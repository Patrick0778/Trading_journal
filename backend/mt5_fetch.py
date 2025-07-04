import sys
#from . import MetaTrader5 as mt5
import MetaTrader5 as mt5
import json
from datetime import datetime, timedelta
from collections import defaultdict
import os
from supabase import create_client, Client

# Supabase configuration
SUPABASE_URL = "https://uatxrhkbslqnfazzodyo.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhdHhyaGtic2xxbmZhenpvZHlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NjUwODcsImV4cCI6MjA2NDU0MTA4N30.RvrbYmZ5bew9lDFyjFolswBk-TxN-YMdm8hbdy6ugZs"

def get_supabase_client() -> Client:
    return create_client(SUPABASE_URL, SUPABASE_KEY)

def insert_trade_to_supabase(supabase: Client, trade_data: dict, user_id: str = ""):
    """Insert a trade into Supabase trades table"""
    try:
        trade_record = {
            'user_id': user_id,
            'date': trade_data.get('date'),
            'ticker': trade_data.get('symbol'),
            'direction': trade_data.get('direction'),
            'entry': trade_data.get('entry_price'),
            'exit': trade_data.get('exit_price'),
            'size': trade_data.get('volume'),
            'pnl': trade_data.get('profit'),
            'notes': trade_data.get('notes', ''),
            'tags': trade_data.get('tags', []),
            'strategy': trade_data.get('strategy', ''),
            'market_condition': trade_data.get('market_condition', ''),
            'instrument_type': trade_data.get('instrument_type', ''),
            'win_loss': trade_data.get('win_loss', ''),
            'screenshot_url': trade_data.get('screenshot_url', '')
        }
        
        result = supabase.table('trades').insert(trade_record).execute()
        return result
    except Exception as e:
        print(f"Error inserting trade to Supabase: {e}", file=sys.stderr)
        return None

def main():
    if len(sys.argv) < 4:
        print(json.dumps({'error': 'Missing arguments'}))
        sys.exit(1)
    server, login, password = sys.argv[1:4]
    login = int(login)
    if not mt5.initialize(server=server, login=login, password=password):
        print(json.dumps({'error': 'MT5 connection failed'}))
        sys.exit(1)

    from_date = datetime.now() - timedelta(days=365)
    deals = mt5.history_deals_get(from_date, datetime.now())
    if not deals:
        print(json.dumps({'error': 'No deals found'}))
        mt5.shutdown()
        sys.exit(0)

    # Initialize Supabase client
    supabase = get_supabase_client()
    
    # Prepare metrics
    total_trades = 0
    winning_trades = 0
    losing_trades = 0
    total_profit = 0.0
    total_loss = 0.0
    net_profit = 0.0
    max_consecutive_wins = 0
    max_consecutive_losses = 0
    current_wins = 0
    current_losses = 0
    average_lot_size = 0.0
    total_lots = 0.0
    pips_gained = 0.0
    pips_lost = 0.0
    best_trade = None
    worst_trade = None
    buy_trades = 0
    sell_trades = 0
    buy_profit = 0.0
    sell_profit = 0.0
    deposits = 0.0
    withdrawals = 0.0
    lot_sizes = []
    trade_returns = []
    trade_returns_usd = []
    currency = None
    
    # Store individual trades for Supabase insertion
    trades_to_insert = []

    for deal in deals:
        if hasattr(deal, 'entry') and deal.entry == mt5.DEAL_ENTRY_IN:
            total_trades += 1
            lot = abs(deal.volume)
            lot_sizes.append(lot)
            total_lots += lot
            profit = deal.profit
            net_profit += profit
            
            # Prepare trade data for Supabase
            trade_data = {
                'date': datetime.fromtimestamp(deal.time).isoformat(),
                'symbol': getattr(deal, 'symbol', ''),
                'direction': 'BUY' if deal.type == mt5.DEAL_TYPE_BUY else 'SELL',
                'entry_price': getattr(deal, 'price', 0.0),
                'exit_price': getattr(deal, 'price', 0.0),  # MT5 deals show single price
                'volume': lot,
                'profit': profit,
                'win_loss': 'WIN' if profit > 0 else 'LOSS' if profit < 0 else 'BREAKEVEN',
                'notes': '',
                'tags': [],
                'strategy': '',
                'market_condition': '',
                'instrument_type': 'FOREX' if 'JPY' in getattr(deal, 'symbol', '') else 'STOCK',
                'screenshot_url': ''
            }
            trades_to_insert.append(trade_data)
            
            if profit > 0:
                winning_trades += 1
                total_profit += profit
                current_wins += 1
                current_losses = 0
                if current_wins > max_consecutive_wins:
                    max_consecutive_wins = current_wins
            elif profit < 0:
                losing_trades += 1
                total_loss += profit
                current_losses += 1
                current_wins = 0
                if current_losses > max_consecutive_losses:
                    max_consecutive_losses = current_losses
            else:
                current_wins = 0
                current_losses = 0
            if best_trade is None or profit > best_trade:
                best_trade = profit
            if worst_trade is None or profit < worst_trade:
                worst_trade = profit
            if deal.type == mt5.DEAL_TYPE_BUY:
                buy_trades += 1
                buy_profit += profit
            elif deal.type == mt5.DEAL_TYPE_SELL:
                sell_trades += 1
                sell_profit += profit
            # Pips calculation (approximate, depends on symbol)
            if hasattr(deal, 'price') and hasattr(deal, 'symbol'):
                # For demonstration, assume 4-digit pairs, 1 pip = 0.0001
                pip_value = 0.0001 if 'JPY' not in deal.symbol else 0.01
                pips = profit / (lot * 10) if lot > 0 else 0
                if profit > 0:
                    pips_gained += abs(pips)
                elif profit < 0:
                    pips_lost += abs(pips)
            # Return percentage (approximate)
            if hasattr(deal, 'price') and deal.price > 0:
                trade_return = (profit / (deal.price * lot)) * 100 if lot > 0 else 0
                trade_returns.append(trade_return)
                trade_returns_usd.append(profit)
            if currency is None and hasattr(deal, 'currency'):  # Try to get currency
                currency = getattr(deal, 'currency', None)
        elif hasattr(deal, 'type') and deal.type == mt5.DEAL_TYPE_BALANCE:
            if deal.profit > 0:
                deposits += deal.profit
            elif deal.profit < 0:
                withdrawals += abs(deal.profit)

    # Insert trades to Supabase
    inserted_trades = 0
    for trade in trades_to_insert:
        if insert_trade_to_supabase(supabase, trade):
            inserted_trades += 1

    average_lot_size = sum(lot_sizes) / len(lot_sizes) if lot_sizes else 0.0
    win_rate = (winning_trades / total_trades * 100) if total_trades > 0 else 0.0
    best_trade_return = max(trade_returns) if trade_returns else 0.0
    best_trade_usd = max(trade_returns_usd) if trade_returns_usd else 0.0

    result = {
        'totalTrades': total_trades,
        'winningTrades': winning_trades,
        'losingTrades': losing_trades,
        'winRate': round(win_rate, 2),
        'totalProfit': round(total_profit, 2),
        'totalLoss': round(total_loss, 2),
        'netProfit': round(net_profit, 2),
        'maxConsecutiveWins': max_consecutive_wins,
        'maxConsecutiveLosses': max_consecutive_losses,
        'averageLotSize': round(average_lot_size, 2),
        'totalLots': round(total_lots, 2),
        'pipsGained': round(pips_gained, 2),
        'pipsLost': round(pips_lost, 2),
        'bestTrade': round(best_trade, 2) if best_trade is not None else 0.0,
        'worstTrade': round(worst_trade, 2) if worst_trade is not None else 0.0,
        'bestTradeReturnPercent': round(best_trade_return, 2),
        'bestTradeReturnUSD': round(best_trade_usd, 2),
        'buyTrades': buy_trades,
        'sellTrades': sell_trades,
        'buyProfit': round(buy_profit, 2),
        'sellProfit': round(sell_profit, 2),
        'deposits': round(deposits, 2),
        'withdrawals': round(withdrawals, 2),
        'currency': currency or '',
        'insertedTrades': inserted_trades,
        'message': f'Successfully inserted {inserted_trades} trades to Supabase'
    }
    print(json.dumps(result))
    mt5.shutdown()

if __name__ == '__main__':
    main()
