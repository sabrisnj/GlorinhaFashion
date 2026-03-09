import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  CreditCard, 
  Wallet, 
  Banknote, 
  QrCode, 
  Copy, 
  CheckCircle, 
  UserPlus,
  Info
} from 'lucide-react';
import { Client } from '../types';

interface PaymentProps {
  client: Client | null;
}

export function Payment({ client }: PaymentProps) {
  const [copied, setCopied] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const pixKey = "11967554525";

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCheckIn = async () => {
    if (!client || !referralCode) {
      alert('Por favor, informe o código de indicação ou voucher.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: client.id,
          referral_code: referralCode,
          is_manual: true
        }),
      });
      if (response.ok) {
        setSuccess(true);
      }
    } catch (error) {
      alert('Erro ao realizar check-in.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 space-y-6"
      >
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle size={48} />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-display font-bold text-ink">Solicitação Enviada!</h2>
          <p className="text-gray-custom">
            Sua solicitação de check-in foi enviada e aguarda aprovação do administrador para validar seu desconto.
          </p>
        </div>
        <button 
          onClick={() => window.location.href = '/perfil'}
          className="btn-primary w-full"
        >
          Ver Meu Perfil
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-display font-bold text-ink uppercase tracking-tight">Pagamento</h1>
        <p className="text-xs text-gray-custom font-bold uppercase tracking-widest">Escolha sua forma de pagamento</p>
      </header>

      {/* Payment Methods Grid */}
      <div className="grid grid-cols-2 gap-4">
        <PaymentMethodCard icon={QrCode} label="PIX" active />
        <PaymentMethodCard icon={CreditCard} label="Débito" />
        <PaymentMethodCard icon={CreditCard} label="Crédito" />
        <PaymentMethodCard icon={Banknote} label="Dinheiro" />
      </div>

      {/* PIX Details */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card bg-orange-50/80 backdrop-blur-sm border-orange-200 p-8 space-y-6 shadow-xl shadow-orange-100/50"
      >
        <div className="flex items-center gap-4 text-primary">
          <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
            <QrCode size={28} />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-ink">Pagamento via PIX</h3>
            <p className="text-[10px] text-gray-custom uppercase font-bold tracking-widest">Chave Celular</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border-2 border-orange-100 flex items-center justify-between group hover:border-primary transition-all">
            <span className="font-mono font-bold text-lg text-ink tracking-widest">{pixKey}</span>
            <button 
              onClick={handleCopyPix}
              className={`p-3 rounded-xl transition-all shadow-md ${copied ? 'bg-green-500 text-white' : 'bg-orange-100 text-primary hover:bg-primary hover:text-white'}`}
            >
              {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
            </button>
          </div>
          
          <p className="text-[10px] text-center text-gray-custom font-bold uppercase tracking-widest">
            {copied ? '✨ Chave copiada com sucesso!' : 'Toque no botão para copiar a chave PIX'}
          </p>
        </div>
      </motion.div>

      {/* Check-in Section */}
      <section className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-ink">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <Info size={18} />
            </div>
            <h2 className="font-display text-xl font-bold">Check-in na Loja</h2>
          </div>
          <span className="text-[10px] font-bold uppercase text-primary bg-primary/5 px-3 py-1 rounded-full">Ganhe 5% OFF</span>
        </div>
        
        <p className="text-sm text-gray-custom leading-relaxed font-medium">
          Realize o check-in manual para validar sua visita e garantir seus descontos de indicação ou vouchers especiais.
        </p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card space-y-6 border-primary/20 bg-white shadow-xl shadow-gray-100 p-8"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-custom ml-1">Código de Indicação ou Voucher</label>
              <div className="relative">
                <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Ex: GLORIA-123 ou INDICA5" 
                  className="input-field pl-12 bg-gray-50/50 focus:bg-white border-gray-100"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                />
              </div>
            </div>
            
            <button 
              onClick={handleCheckIn}
              disabled={loading || !referralCode}
              className="btn-primary w-full py-4 flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-primary/20"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <CheckCircle size={20} />
              )}
              <span className="font-bold uppercase tracking-widest text-sm">Confirmar Check-in</span>
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

function PaymentMethodCard({ icon: Icon, label, active }: any) {
  return (
    <div className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
      active ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 bg-white text-gray-custom'
    }`}>
      <Icon size={20} />
      <span className="text-[10px] font-bold uppercase">{label}</span>
    </div>
  );
}
