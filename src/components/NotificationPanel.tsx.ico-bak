import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, X, Volume2, VolumeX, Target, Play, Square, Trophy, Settings, Trash2 } from 'lucide-react';
import { onNotification, getNotificationChannel } from '@/lib/supabase-db';
import { toast } from 'sonner';

export interface Notification {
  id: string;
  type: 'goal' | 'goal_scorer' | 'match_start' | 'match_end' | 'half_time' | 'player_of_week';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

interface NotificationPreferences {
  goals: boolean;
  matchStart: boolean;
  matchEnd: boolean;
  halfTime: boolean;
  playerOfWeek: boolean;
  soundEnabled: boolean;
}

const defaultPrefs: NotificationPreferences = {
  goals: true,
  matchStart: true,
  matchEnd: true,
  halfTime: true,
  playerOfWeek: true,
  soundEnabled: true,
};

const getPrefs = (): NotificationPreferences => {
  try {
    const saved = localStorage.getItem('ffk_notification_prefs');
    if (saved) return { ...defaultPrefs, ...JSON.parse(saved) };
  } catch {}
  return defaultPrefs;
};

const savePrefs = (prefs: NotificationPreferences) => {
  localStorage.setItem('ffk_notification_prefs', JSON.stringify(prefs));
};

const NotificationPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [prefs, setPrefs] = useState<NotificationPreferences>(getPrefs());
  const panelRef = useRef<HTMLDivElement>(null);
  const channelInitialized = useRef(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = useCallback((notif: Omit<Notification, 'id' | 'read'>) => {
    const newNotif: Notification = {
      ...notif,
      id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev].slice(0, 50));

    // Show toast
    const currentPrefs = getPrefs();
    if (currentPrefs.soundEnabled) {
      // Simple beep using Web Audio API
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 800;
        gain.gain.value = 0.1;
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } catch {}
    }

    toast(notif.title, {
      description: notif.message,
      duration: 5000,
    });
  }, []);

  // Subscribe to broadcast notifications
  useEffect(() => {
    if (channelInitialized.current) return;
    channelInitialized.current = true;

    // Initialize channel
    getNotificationChannel();

    // Goal scored
    onNotification('goal', (payload) => {
      const p = getPrefs();
      if (!p.goals) return;
      addNotification({
        type: 'goal',
        title: 'GOL!',
        message: `${payload.homeTeam} ${payload.homeScore} - ${payload.awayScore} ${payload.awayTeam}`,
        timestamp: payload.timestamp || Date.now(),
      });
    });

    // Goal with scorer
    onNotification('goal_scorer', (payload) => {
      const p = getPrefs();
      if (!p.goals) return;
      addNotification({
        type: 'goal_scorer',
        title: `GOL! ${payload.scorerName} (${payload.minute}')`,
        message: `${payload.homeTeam} ${payload.homeScore} - ${payload.awayScore} ${payload.awayTeam}`,
        timestamp: payload.timestamp || Date.now(),
      });
    });

    // Match start
    onNotification('match_start', (payload) => {
      const p = getPrefs();
      if (!p.matchStart) return;
      addNotification({
        type: 'match_start',
        title: 'Ndeshja filloi!',
        message: `${payload.homeTeam} vs ${payload.awayTeam}`,
        timestamp: payload.timestamp || Date.now(),
      });
    });

    // Match end
    onNotification('match_end', (payload) => {
      const p = getPrefs();
      if (!p.matchEnd) return;
      addNotification({
        type: 'match_end',
        title: 'Ndeshja përfundoi!',
        message: `${payload.homeTeam} ${payload.homeScore} - ${payload.awayScore} ${payload.awayTeam}`,
        timestamp: payload.timestamp || Date.now(),
      });
    });

    // Half time
    onNotification('half_time', (payload) => {
      const p = getPrefs();
      if (!p.halfTime) return;
      addNotification({
        type: 'half_time',
        title: 'Pushim!',
        message: `${payload.homeTeam} ${payload.homeScore} - ${payload.awayScore} ${payload.awayTeam}`,
        timestamp: payload.timestamp || Date.now(),
      });
    });

    // Player of week
    onNotification('player_of_week', (payload) => {
      const p = getPrefs();
      if (!p.playerOfWeek) return;
      addNotification({
        type: 'player_of_week',
        title: 'Lojtari i Javës!',
        message: payload.playerName || 'Lojtari i ri i javës u zgjodh.',
        timestamp: payload.timestamp || Date.now(),
      });
    });
  }, [addNotification]);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setShowSettings(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const updatePref = (key: keyof NotificationPreferences, value: boolean) => {
    const newPrefs = { ...prefs, [key]: value };
    setPrefs(newPrefs);
    savePrefs(newPrefs);
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'goal':
      case 'goal_scorer':
        return <Target className="w-4 h-4 text-green-500" />;
      case 'match_start':
        return <Play className="w-4 h-4 text-blue-500" />;
      case 'match_end':
        return <Square className="w-4 h-4 text-red-500" />;
      case 'half_time':
        return <div className="w-4 h-4 rounded-full border-2 border-orange-500 flex items-center justify-center text-[6px] font-bold text-orange-500">HT</div>;
      case 'player_of_week':
        return <Trophy className="w-4 h-4 text-yellow-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatTime = (ts: number) => {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return 'tani';
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button
        onClick={() => { setIsOpen(!isOpen); setShowSettings(false); }}
        className="relative p-2 text-gray-300 hover:text-white transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center min-w-[18px] px-1">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
            <h3 className="font-semibold text-gray-800 text-sm">Njoftimet</h3>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-1.5 rounded-lg transition-colors ${showSettings ? 'bg-[#1E6FF2] text-white' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
                title="Cilësimet"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
              {notifications.length > 0 && (
                <>
                  <button onClick={markAllRead} className="p-1.5 text-gray-400 hover:text-[#1E6FF2] hover:bg-gray-100 rounded-lg" title="Lexo të gjitha">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                    </svg>
                  </button>
                  <button onClick={clearAll} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-lg" title="Pastro">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="p-4 border-b border-gray-100 bg-blue-50/50 space-y-2">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Preferencat e Njoftime</p>
              {[
                { key: 'goals' as const, label: 'Golat', icon: <Target className="w-3.5 h-3.5 text-green-500" /> },
                { key: 'matchStart' as const, label: 'Fillimi i ndeshjes', icon: <Play className="w-3.5 h-3.5 text-blue-500" /> },
                { key: 'matchEnd' as const, label: 'Fundi i ndeshjes', icon: <Square className="w-3.5 h-3.5 text-red-500" /> },
                { key: 'halfTime' as const, label: 'Pushimi', icon: <div className="w-3.5 h-3.5 rounded-full border border-orange-500" /> },
                { key: 'playerOfWeek' as const, label: 'Lojtari i javës', icon: <Trophy className="w-3.5 h-3.5 text-yellow-500" /> },
              ].map(item => (
                <label key={item.key} className="flex items-center justify-between py-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span className="text-sm text-gray-700">{item.label}</span>
                  </div>
                  <div
                    onClick={() => updatePref(item.key, !prefs[item.key])}
                    className={`w-9 h-5 rounded-full transition-colors cursor-pointer flex items-center ${prefs[item.key] ? 'bg-[#1E6FF2]' : 'bg-gray-300'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${prefs[item.key] ? 'translate-x-4.5 ml-[18px]' : 'translate-x-0.5 ml-[2px]'}`} />
                  </div>
                </label>
              ))}
              <label className="flex items-center justify-between py-1 cursor-pointer border-t border-gray-200 pt-2 mt-2">
                <div className="flex items-center gap-2">
                  {prefs.soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-gray-500" /> : <VolumeX className="w-3.5 h-3.5 text-gray-400" />}
                  <span className="text-sm text-gray-700">Tingulli</span>
                </div>
                <div
                  onClick={() => updatePref('soundEnabled', !prefs.soundEnabled)}
                  className={`w-9 h-5 rounded-full transition-colors cursor-pointer flex items-center ${prefs.soundEnabled ? 'bg-[#1E6FF2]' : 'bg-gray-300'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${prefs.soundEnabled ? 'translate-x-4.5 ml-[18px]' : 'translate-x-0.5 ml-[2px]'}`} />
                </div>
              </label>
            </div>
          )}

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-12 text-center">
                <Bell className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Nuk ka njoftime.</p>
                <p className="text-xs text-gray-300 mt-1">Njoftimet do të shfaqen kur ndeshjet janë LIVE.</p>
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                    !n.read ? 'bg-blue-50/30' : ''
                  }`}
                  onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
                >
                  <div className="mt-0.5 flex-shrink-0">{getNotifIcon(n.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!n.read ? 'font-semibold text-gray-800' : 'font-medium text-gray-600'}`}>{n.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 flex-shrink-0 mt-0.5">{formatTime(n.timestamp)}</span>
                  {!n.read && <span className="w-2 h-2 bg-[#1E6FF2] rounded-full flex-shrink-0 mt-1.5" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
