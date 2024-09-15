import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  toasts: any[] = [];

  addToast(type: string, title: string, message: string, duration: number = 5000) {
    const toast = { type, title, message, duration, progress: 100 };
    this.toasts.push(toast);
    this.updateProgress(toast);
  }

  removeToast(index: number) {
    this.toasts.splice(index, 1);
  }

  updateProgress(toast: any) {
    const interval = 100;
    const progressDecrement = (interval / toast.duration) * 100;

    const intervalId = setInterval(() => {
      if (toast.progress > 0) {
        toast.progress -= progressDecrement;
      } else {
        this.removeToast(this.toasts.indexOf(toast));
        clearInterval(intervalId);
      }
    }, interval);
  }
}
