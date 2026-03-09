import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Shield, Lock } from 'lucide-react';
import { Client } from '../types';

interface RegistrationProps {
  onRegister: (client: Client) => void;
  onAdminLogin: () => void;
}

export function Registration({ onRegister, onAdminLogin }: RegistrationProps) {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !whatsapp) return;

    setLoading(true);
    try {
      console.log('Attempting registration:', { name, whatsapp });
      const response = await fetch('/api/auth/client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, whatsapp }),
      });
      
      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error('Non-JSON response received:', text);
        if (response.status === 404) {
          throw new Error('Erro 404: A rota da API não foi encontrada. Verifique se o servidor backend está configurado corretamente.');
        }
        throw new Error(`Erro no servidor (${response.status}). O servidor não retornou JSON. Detalhes: ${text.substring(0, 100)}...`);
      }

      console.log('Registration response:', data);

      if (response.ok) {
        onRegister(data);
      } else {
        throw new Error(data.error || 'Erro ao realizar cadastro');
      }
    } catch (error: any) {
      alert(error.message || 'Erro ao realizar cadastro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'Gloria_Fashion') {
      onAdminLogin();
    } else {
      alert('Senha administrativa incorreta.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-paper relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-peach/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-azure/10 rounded-full blur-3xl" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 relative z-10"
      >
        <div className="text-center space-y-3">
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl border-4 border-white">
            <Heart className="text-white" size={48} />
          </div>
          <h1 className="text-5xl font-display font-bold text-ink tracking-tighter">Glória Fashion</h1>
          <p className="text-gray-custom font-medium">Seja bem-vinda ao seu espaço de beleza e estilo.</p>
        </div>

        {!showAdmin ? (
          <form onSubmit={handleSubmit} className="card space-y-6 border-peach/20 shadow-xl shadow-peach/5 p-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-custom ml-1">Seu Nome Completo</label>
              <input 
                type="text" 
                className="input-field border-gray-100 bg-gray-50/50 focus:bg-white" 
                placeholder="Ex: Maria Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-custom ml-1">WhatsApp</label>
              <input 
                type="tel" 
                className="input-field border-gray-100 bg-gray-50/50 focus:bg-white" 
                placeholder="Ex: 11 95069-6045"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn-primary w-full py-4 text-sm font-bold uppercase tracking-widest mt-2 shadow-xl shadow-primary/20"
              disabled={loading}
            >
              {loading ? 'Acessando...' : 'Começar Agora'}
            </button>
            <p className="text-[9px] text-center text-gray-400 mt-6 leading-relaxed uppercase tracking-wider font-medium">
              Ao entrar, você concorda com nossa Política de Privacidade e LGPD.
            </p>
          </form>
        ) : (
          <form onSubmit={handleAdminLogin} className="card space-y-4 border-peach/20">
            <div className="flex items-center gap-2 mb-2">
              <Lock size={18} className="text-primary" />
              <h2 className="font-display text-xl text-ink">Acesso Administrativo</h2>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-custom ml-1">Senha</label>
              <input 
                type="password" 
                className="input-field border-gray-200" 
                placeholder="Digite a senha"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full shadow-lg shadow-primary/20">Entrar no Painel</button>
            <button 
              type="button" 
              onClick={() => setShowAdmin(false)}
              className="w-full text-sm text-gray-custom hover:text-ink transition-colors"
            >
              Voltar para Cadastro
            </button>
          </form>
        )}

        <div className="flex justify-center pt-8">
          <button 
            onClick={() => setShowAdmin(true)}
            className="flex items-center gap-2 text-gray-200 hover:text-primary transition-colors text-xs uppercase tracking-widest"
          >
            <Shield size={14} />
            Admin
          </button>
        </div>
      </motion.div>
    </div>
  );
}
