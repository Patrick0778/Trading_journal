
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const AccountSelector = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [accountName, setAccountName] = useState('');
  const [platform, setPlatform] = useState('');
  const [server, setServer] = useState('');
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');

  const handleAddAccount = async () => {
    // Here you would save the MT account to Supabase
    // For now, we'll just show a toast
    toast({
      title: "Account Added",
      description: `${accountName} (${platform}) has been added successfully.`
    });
    
    // Reset form
    setAccountName('');
    setPlatform('');
    setServer('');
    setLoginId('');
    setPassword('');
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          style={{ borderColor: '#B38B59', color: '#B38B59' }}
        >
          <Settings className="h-4 w-4" />
          MT Accounts
        </Button>
      </DialogTrigger>
      <DialogContent style={{ backgroundColor: '#FEFEFE' }}>
        <DialogHeader>
          <DialogTitle style={{ color: '#113E21' }}>Add MetaTrader Account</DialogTitle>
          <DialogDescription>
            Connect your MT4 or MT5 account to start analyzing your trades.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="accountName" style={{ color: '#113E21' }}>Account Name</Label>
            <Input
              id="accountName"
              placeholder="My Trading Account"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="platform" style={{ color: '#113E21' }}>Platform</Label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MT4">MetaTrader 4</SelectItem>
                <SelectItem value="MT5">MetaTrader 5</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="server" style={{ color: '#113E21' }}>Server</Label>
            <Input
              id="server"
              placeholder="broker-server.com:443"
              value={server}
              onChange={(e) => setServer(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="loginId" style={{ color: '#113E21' }}>Login ID</Label>
            <Input
              id="loginId"
              placeholder="123456"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="password" style={{ color: '#113E21' }}>Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Your trading password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleAddAccount}
            className="w-full"
            style={{ backgroundColor: '#B38B59', borderColor: '#B38B59' }}
            disabled={!accountName || !platform || !server || !loginId || !password}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Account
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
