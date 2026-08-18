// Notification permissions management

export const notificationPermissions = {
  // Check if browser supports notifications
  isSupported: (): boolean => {
    return 'Notification' in window;
  },

  // Get current permission status
  getPermission: (): NotificationPermission => {
    if (!notificationPermissions.isSupported()) return 'denied';
    return Notification.permission;
  },

  // Request notification permission
  requestPermission: async (): Promise<NotificationPermission> => {
    if (!notificationPermissions.isSupported()) return 'denied';
    
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      localStorage.setItem('notifications_enabled', 'true');
    }
    return permission;
  },

  // Check if notifications are enabled in app
  isEnabled: (): boolean => {
    return localStorage.getItem('notifications_enabled') === 'true' && 
           notificationPermissions.getPermission() === 'granted';
  },

  // Enable notifications in app
  enable: async (): Promise<boolean> => {
    const permission = await notificationPermissions.requestPermission();
    if (permission === 'granted') {
      localStorage.setItem('notifications_enabled', 'true');
      return true;
    }
    return false;
  },

  // Disable notifications in app
  disable: (): void => {
    localStorage.setItem('notifications_enabled', 'false');
  },

  // Send a notification
  send: (title: string, options?: NotificationOptions): void => {
    if (notificationPermissions.isEnabled()) {
      try {
        new Notification(title, {
          icon: 'https://d64gsuwffb70l.cloudfront.net/69b1c5d3aa33715dda5ad3a9_1773258315744_b173e8af.png',
          badge: 'https://d64gsuwffb70l.cloudfront.net/69b1c5d3aa33715dda5ad3a9_1773258315744_b173e8af.png',
          ...options,
        });
      } catch (err) {
        console.error('Failed to send notification:', err);
      }
    }
  },
};

// Notification service for app events
export const notificationService = {
  notifyMatchFinished: (homeTeam: string, awayTeam: string, homeScore: number, awayScore: number): void => {
    notificationService.send(
      `Ndeshja përfundoi: ${homeTeam} ${homeScore} - ${awayScore} ${awayTeam}`,
      {
        body: `Rezultati final: ${homeTeam} vs ${awayTeam}`,
        tag: 'match-finished',
        requireInteraction: false,
      }
    );
  },

  notifyNewNews: (title: string, description?: string): void => {
    notificationService.send(
      `📰 Lajm i ri: ${title}`,
      {
        body: description || 'Lexo lajmin e ri në aplikacion',
        tag: 'news-posted',
        requireInteraction: false,
      }
    );
  },

  notifyNewVideo: (title: string): void => {
    notificationService.send(
      `🎥 Video e re: ${title}`,
      {
        body: 'Shiko videon e re në aplikacion',
        tag: 'video-posted',
        requireInteraction: false,
      }
    );
  },

  notifyNewTeam: (teamName: string): void => {
    notificationService.send(
      `⚽ Skuadra e re: ${teamName}`,
      {
        body: 'Skuadra e re u shtua në aplikacion',
        tag: 'team-added',
        requireInteraction: false,
      }
    );
  },

  notifyNewMatch: (homeTeam: string, awayTeam: string, time: string): void => {
    notificationService.send(
      `⏰ Ndeshje e re: ${homeTeam} vs ${awayTeam}`,
      {
        body: `Ora: ${time}`,
        tag: 'match-added',
        requireInteraction: false,
      }
    );
  },

  send: (title: string, options?: NotificationOptions): void => {
    notificationPermissions.send(title, options);
  },
};
