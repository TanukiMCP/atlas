/**
 * Simple event bus implementation for inter-component communication
 */
class EventBus {
  private listeners: Map<string, Function[]> = new Map();

  /**
   * Subscribe to an event
   * @param event Event name
   * @param callback Callback function
   * @returns Unsubscribe function
   */
  on(event: string, callback: Function): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    
    this.listeners.get(event)!.push(callback);
    
    // Return unsubscribe function
    return () => {
      const eventListeners = this.listeners.get(event);
      if (eventListeners) {
        const index = eventListeners.indexOf(callback);
        if (index !== -1) {
          eventListeners.splice(index, 1);
        }
      }
    };
  }

  /**
   * Subscribe to an event once (auto-unsubscribe after first call)
   * @param event Event name
   * @param callback Callback function
   */
  once(event: string, callback: Function): void {
    const unsubscribe = this.on(event, (...args: any[]) => {
      unsubscribe();
      callback(...args);
    });
  }

  /**
   * Emit an event with data
   * @param event Event name
   * @param data Event data
   */
  emit(event: string, ...data: any[]): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => {
        try {
          callback(...data);
        } catch (error) {
          console.error(`Error in event listener for "${event}":`, error);
        }
      });
    }
  }

  /**
   * Remove all listeners for an event
   * @param event Event name
   */
  off(event: string): void {
    this.listeners.delete(event);
  }

  /**
   * Clear all event listeners
   */
  clear(): void {
    this.listeners.clear();
  }
}

// Create a singleton instance
export const eventBus = new EventBus(); 