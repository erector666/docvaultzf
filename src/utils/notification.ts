/**
 * Secure notification system to replace alert() calls
 */

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
}

class NotificationManager {
  private notifications: Notification[] = [];
  private listeners: Array<(notifications: Notification[]) => void> = [];

  // Add a new notification
  add(notification: Omit<Notification, 'id'>): void {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration || 5000,
    };

    this.notifications.push(newNotification);
    this.notifyListeners();

    // Auto-remove notification after duration
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, newNotification.duration);
    }
  }

  // Remove a notification
  remove(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifyListeners();
  }

  // Clear all notifications
  clear(): void {
    this.notifications = [];
    this.notifyListeners();
  }

  // Subscribe to notification changes
  subscribe(listener: (notifications: Notification[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  // Convenience methods
  success(title: string, message: string, duration?: number): void {
    this.add({ type: 'success', title, message, duration });
  }

  error(title: string, message: string, duration?: number): void {
    this.add({ type: 'error', title, message, duration });
  }

  warning(title: string, message: string, duration?: number): void {
    this.add({ type: 'warning', title, message, duration });
  }

  info(title: string, message: string, duration?: number): void {
    this.add({ type: 'info', title, message, duration });
  }
}

// Export singleton instance
export const notificationManager = new NotificationManager();

// Convenience functions for common use cases
export const showSuccess = (title: string, message: string) => {
  notificationManager.success(title, message);
};

export const showError = (title: string, message: string) => {
  notificationManager.error(title, message, 8000); // Longer duration for errors
};

export const showWarning = (title: string, message: string) => {
  notificationManager.warning(title, message);
};

export const showInfo = (title: string, message: string) => {
  notificationManager.info(title, message);
};
