export class Booking {
  id: string;
  clientName: string;
  clientPhone: string;
  serviceName: string;
  startTime: Date;
  endTime: Date;
  price: number;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  isFirstTime: boolean;
  notes?: string;

  constructor(data: Omit<Booking, 'id'> & { id?: string }) {
    this.id = data.id || this.generateId();
    this.clientName = data.clientName;
    this.clientPhone = data.clientPhone;
    this.serviceName = data.serviceName;
    this.startTime = data.startTime;
    this.endTime = data.endTime;
    this.price = data.price;
    this.status = data.status;
    this.isFirstTime = data.isFirstTime;
    this.notes = data.notes;
  }

  // Generate a unique ID
  private generateId(): string {
    return `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get duration in minutes
  getDuration(): number {
    return Math.round((this.endTime.getTime() - this.startTime.getTime()) / (1000 * 60));
  }

  // Check if booking is today
  isToday(): boolean {
    const today = new Date();
    return (
      this.startTime.getDate() === today.getDate() &&
      this.startTime.getMonth() === today.getMonth() &&
      this.startTime.getFullYear() === today.getFullYear()
    );
  }

  // Check if booking is upcoming
  isUpcoming(): boolean {
    return (
      this.startTime > new Date() && this.status !== 'cancelled' && this.status !== 'completed'
    );
  }

  // Check if booking is past
  isPast(): boolean {
    return this.endTime < new Date();
  }

  // Check if booking is currently active
  isActive(): boolean {
    const now = new Date();
    return now >= this.startTime && now <= this.endTime && this.status === 'confirmed';
  }

  // Update status
  updateStatus(newStatus: Booking['status']): void {
    this.status = newStatus;
  }

  // Add or update notes
  updateNotes(notes: string): void {
    this.notes = notes;
  }

  // Get formatted time range
  getTimeRange(): string {
    const startTime = this.startTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    const endTime = this.endTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return `${startTime} - ${endTime}`;
  }

  // Get formatted date
  getFormattedDate(): string {
    return this.startTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  // Get formatted price
  getFormattedPrice(): string {
    return `$${this.price.toFixed(2)}`;
  }

  // Check if booking can be cancelled
  canBeCancelled(): boolean {
    return this.status === 'confirmed' || this.status === 'pending';
  }

  // Check if booking can be completed
  canBeCompleted(): boolean {
    return this.status === 'confirmed' && this.isPast();
  }

  // Convert to plain object (useful for API calls or storage)
  toObject(): Booking {
    return {
      id: this.id,
      clientName: this.clientName,
      clientPhone: this.clientPhone,
      serviceName: this.serviceName,
      startTime: this.startTime,
      endTime: this.endTime,
      price: this.price,
      status: this.status,
      isFirstTime: this.isFirstTime,
      notes: this.notes,
    };
  }

  // Convert to JSON string
  toJSON(): string {
    return JSON.stringify(this.toObject());
  }
}
