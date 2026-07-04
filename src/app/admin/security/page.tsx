'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { getSecurityStatus, getSecurityLogs, toggleSecuritySetting, clearSecurityLogs, SecurityLogItem } from '@/api/security';

export default function SecurityControlRoom() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!token || !userData) {
        router.replace('/login');
      } else {
        const user = JSON.parse(userData);
        setIsAdmin(user.role === 'ADMIN');
      }
    }
  }, [router]);

  // SWR for polling security configurations and logs
  const { data: status, mutate: mutateStatus } = useSWR('securityStatus', getSecurityStatus, {
    refreshInterval: 1500,
  });

  const { data: logs, mutate: mutateLogs } = useSWR('securityLogs', getSecurityLogs, {
    refreshInterval: 1500,
  });

  if (!status) return null;

  const handleToggle = async (vulnerability: string, currentEnabled: boolean) => {
    try {
      await toggleSecuritySetting(vulnerability, !currentEnabled);
      mutateStatus();
    } catch (err) {
      alert('Failed to toggle vulnerability shield.');
    }
  };

  const handleClearLogs = async () => {
    try {
      await clearSecurityLogs();
      mutateLogs();
    } catch (err) {
      alert('Failed to clear logs.');
    }
  };

  const vulnerabilityDefinitions = [
    {
      key: 'sqli',
      label: 'SQL Injection (SQLi) Protection',
      description: 'Protects authentication inputs and history lookup parameters against malformed SQL statements.',
      flag: status.sqliEnabled,
      vulnCode: `// String concatenation (Vulnerable)\nString sql = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'";\nQuery q = em.createNativeQuery(sql);`,
      secureCode: `// Prepared statement parameters (Secure)\nOptional<User> u = userRepository.findByUsername(username);\nif (u.isPresent() && encoder.matches(password, u.get().getPassword())) { ... }`
    },
    {
      key: 'xss',
      label: 'Stored Cross-Site Scripting (XSS) Filter',
      description: 'Cleans, escapes, and sanitizes transaction descriptions before database writes.',
      flag: status.xssEnabled,
      vulnCode: `// Saving raw input directly (Vulnerable)\nTransaction tx = new Transaction(..., description);\ntxRepository.save(tx);\n\n// React dangerouslySetInnerHTML\n<div dangerouslySetInnerHTML={{ __html: tx.description }} />`,
      secureCode: `// HTML escaping input on backend (Secure)\nString safeDescription = HtmlUtils.htmlEscape(description);\nTransaction tx = new Transaction(..., safeDescription);\ntxRepository.save(tx);`
    },
    {
      key: 'idor',
      label: 'IDOR / BOLA Account Validation',
      description: 'Enforces strict checks between user token scope and requested path accounts.',
      flag: status.idorEnabled,
      vulnCode: `// Trusting client-provided accountNumber (Vulnerable)\nAccount account = accountRepository.findByAccountNumber(accountNumber);\nreturn ResponseEntity.ok(account);`,
      secureCode: `// Verifying authenticated user context (Secure)\nString currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();\nif (!account.getUser().getUsername().equals(currentUsername)) {\n    return ResponseEntity.status(403).body("Access Denied");\n}`
    },
    {
      key: 'param_tampering',
      label: 'Parameter Tampering Guard',
      description: 'Enforces business checks for transfer parameters: positive numbers, bounds, and user ownership.',
      flag: status.paramTamperingEnabled,
      vulnCode: `// Accepting raw amount and sender params (Vulnerable)\nsourceAccount.setBalance(sourceAccount.getBalance() - amount);\ntargetAccount.setBalance(targetAccount.getBalance() + amount);`,
      secureCode: `// Strictly verifying parameters (Secure)\nif (!sourceAccount.getUser().getUsername().equals(currentUsername))\n    throw new SecurityException("Tampering detected");\nif (amount <= 0)\n    throw new IllegalArgumentException("Positive amount required");`
    },
    {
      key: 'brute_force',
      label: 'Brute Force Rate Limiter',
      description: 'Maintains failed attempt window and blocks brute-forcing IPs after 5 failures.',
      flag: status.bruteForceEnabled,
      vulnCode: `// Unlimited auth tries allowed (Vulnerable)\nUser user = lookupUser(username);\nif (user == null || !matches(password, user)) {\n    return ResponseEntity.status(401).build();\n}`,
      secureCode: `// Failed attempts tracker (Secure)\nList<Long> failures = loginFailures.get(clientIp);\nif (failures.size() >= 5) {\n    return ResponseEntity.status(429).body("Too Many Requests");\n}`
    }
  ];

  return (
    <div className="flex min-h-screen bg-[#FAFAF5] text-black font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <Navbar title="Security Command Center" />

        <main className="flex-1 p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Header */}
          <div className="border-b border-[#E5E7EB] pb-6">
            <span className="text-[9px] text-[#228B22] font-mono font-bold tracking-widest uppercase bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
              Security Control Room
            </span>
            <h3 className="text-3xl font-extrabold text-[#1B4332] tracking-tight mt-2.5 font-heading">Security Policies Configuration</h3>
            <p className="text-sm text-[#52796F] mt-1 font-medium">Configure active vulnerability parameters, analyze defense codes, and inspect incoming cyber attack triggers.</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            
            {/* Left Side: Shields & Code comparisons */}
            <div className="xl:col-span-7 space-y-6">
              <h4 className="text-xs font-bold text-[#52796F] uppercase tracking-widest">Active Security Shields</h4>
              
              <div className="space-y-6">
                {vulnerabilityDefinitions.map((def) => (
                  <div key={def.key} className={`glass-panel rounded-3xl p-6 border border-[#E5E7EB] bg-white hover:border-[#1B4332]/35 shadow-sm`}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-[#1B4332] tracking-wide">{def.label}</h4>
                        <p className="text-xs text-[#52796F] mt-1 font-medium">{def.description}</p>
                      </div>

                      {/* Active Toggle Switch */}
                      <div className="flex items-center gap-3">
                        <span className={`text-[8px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                          def.flag 
                            ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20' 
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-500/20'
                        }`}>
                          {def.flag ? 'Vulnerable' : 'Defended'}
                        </span>

                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={def.flag} 
                            onChange={() => handleToggle(def.key, def.flag)}
                            className="sr-only peer" 
                          />
                          <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600 peer-checked:after:bg-white"></div>
                        </label>
                      </div>
                    </div>

                    {/* Explanatory Diffs */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#E5E7EB] text-[9px] font-mono leading-relaxed">
                      <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-xl space-y-1.5">
                        <span className="text-rose-700 font-bold block">Vulnerable Pathway:</span>
                        <pre className="text-rose-650/90 overflow-x-auto whitespace-pre-wrap leading-normal">{def.vulnCode}</pre>
                      </div>
                      <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-1.5">
                        <span className="text-emerald-700 font-bold block">Mitigation Defense:</span>
                        <pre className="text-emerald-650/90 overflow-x-auto whitespace-pre-wrap leading-normal">{def.secureCode}</pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Cyber SIEM Live Log Feed */}
            <div className="xl:col-span-5 space-y-6">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-[#52796F] uppercase tracking-widest">SIEM Live Incident Feed</h4>
                {logs && logs.length > 0 && (
                  <button 
                    onClick={handleClearLogs}
                    className="text-[9px] font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-lg transition-all"
                  >
                    Flush Event Log
                  </button>
                )}
              </div>

              <div className="glass-panel rounded-3xl p-6 min-h-[500px] max-h-[750px] overflow-y-auto space-y-4 border border-[#E5E7EB] bg-white shadow-sm">
                {logs && logs.length > 0 ? (
                  logs.map((log: SecurityLogItem) => (
                    <div 
                      key={log.id} 
                      className={`p-4 rounded-2xl border bg-[#FAFAF5] space-y-2.5 hover-scale ${
                        log.status === 'BLOCKED' 
                          ? 'border-rose-350/20 shadow-sm shadow-rose-500/5' 
                          : 'border-[#E5E7EB]'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className={`px-2 py-0.5 rounded font-mono text-[8px] font-bold ${
                            log.status === 'BLOCKED' ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20' : 'bg-yellow-50 text-yellow-700 border border-yellow-500/20'
                          }`}>
                            {log.attackType} • {log.status}
                          </span>
                          <span className="block text-[8px] text-[#52796F] font-mono mt-1 font-semibold">IP: {log.clientIp} • {new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <span className="text-[9px] font-mono text-[#228B22] font-bold">{log.endpoint.split(' ')[0]}</span>
                      </div>

                      <div className="text-[9px] font-mono text-[#52796F] bg-black p-2.5 rounded-xl border border-slate-900 overflow-x-auto">
                        <span className="text-slate-500">Request Payload:</span> {log.payload}
                      </div>

                      <p className="text-[11px] text-slate-800 leading-relaxed font-sans">{log.description}</p>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center min-h-[420px] text-center text-[#52796F]">
                    <div>
                      <p className="text-sm font-semibold text-[#1B4332]">SIEM Ledger Clear</p>
                      <p className="text-[10px] text-[#52796F]/70 mt-1 max-w-[200px] mx-auto">Interventions and mitigation alerts will display here in real-time when clients trigger security violations.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
