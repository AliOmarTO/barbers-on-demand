import { BookingInterface } from '@/types';
import { Booking } from './Booking';

// Enums and Types
export enum ServiceType {
  MOBILE_ONLY = 'mobile_only',
  SHOP = 'shop',
  BOTH = 'both',
}

export enum AvailabilityStatus {
  AVAILABLE = 'available',
  BUSY = 'busy',
  OFFLINE = 'offline',
}

export enum VerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  mobilePrice?: number; // additional charge for mobile service
}

export interface Availability {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // "09:00"
  endTime: string; // "17:00"
  isAvailable: boolean;
}

export interface TimeSlot {
  start: Date;
  end: Date;
  isBooked: boolean;
  appointmentId?: string;
}

export interface Review {
  id: string;
  clientId: string;
  clientName: string;
  rating: number; // 1-5
  comment: string;
  date: Date;
  serviceIds: string[];
}

export interface BarberProfile {
  bio: string;
  specialties: string[];
  portfolioImages: string[]; // URLs
  certifications: string[];
  yearsExperience: number;
  languages: string[];
}

export interface MobileServiceInfo {
  serviceRadius: number; // in miles
}

export interface ShopInfo {
  address: Location;
  photos: string[];
}

export interface BusinessInfo {
  licenseNumber?: string;
  insurancePolicy?: string;
  taxId?: string;
  businessName?: string;
}

export interface NotificationSettings {
  newBookings: boolean;
  cancellations: boolean;
  reminders: boolean;
  promotions: boolean;
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
}

export interface Policies {
  cancellationPolicy: string;
  noShowPolicy: string;
  refundPolicy: string;
  advanceBookingDays: number;
  sameDayBooking: boolean;
}

// Main Barber Class
export class Barber {
  // Basic Info
  public id: string;
  public email: string;
  public phone: string;
  public firstName: string;
  public lastName: string;
  public profileImage?: string;
  public dateOfBirth?: Date;
  public createdAt: Date;
  public updatedAt: Date;

  // bookings
  public bookings: BookingInterface[];

  // Service Configuration
  public serviceType: ServiceType;
  public services: Service[];
  public mobileServiceInfo?: MobileServiceInfo;
  public ShopInfo?: ShopInfo;

  // Profile & Professional Info
  public profile: BarberProfile;
  public businessInfo: BusinessInfo;

  // Scheduling & Availability
  public weeklyAvailability: Availability[];
  public blockedDates: Date[]; // vacation, holidays, etc.
  public bufferTimeBetweenAppointments: number; // minutes
  public currentStatus: AvailabilityStatus;

  // Reviews & Ratings
  public reviews: Review[];
  public averageRating: number;
  public totalReviews: number;

  // Verification & Trust
  public verificationStatus: VerificationStatus;
  public backgroundCheckCompleted: boolean;
  public licenseVerified: boolean;
  public identityVerified: boolean;

  // Settings
  public notificationSettings: NotificationSettings;
  public policies: Policies;
  public isActive: boolean;
  public isOnboarded: boolean;

  // Financial
  public bankAccountConnected: boolean;
  public totalEarnings: number;
  public pendingPayouts: number;

  constructor(data: Partial<Barber>) {
    this.id = data.id || '';
    this.email = data.email || '';
    this.phone = data.phone || '';
    this.firstName = data.firstName || '';
    this.lastName = data.lastName || '';
    this.profileImage = data.profileImage;
    this.dateOfBirth = data.dateOfBirth;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();

    this.bookings = data.bookings || [];

    this.serviceType = data.serviceType || ServiceType.MOBILE_ONLY;
    this.services = data.services || [];
    this.mobileServiceInfo = data.mobileServiceInfo;
    this.ShopInfo = data.ShopInfo;

    this.profile = data.profile || {
      bio: '',
      specialties: [],
      portfolioImages: [],
      certifications: [],
      yearsExperience: 0,
      languages: ['English'],
    };

    this.businessInfo = data.businessInfo || {};

    this.weeklyAvailability = data.weeklyAvailability || this.getDefaultAvailability();
    this.blockedDates = data.blockedDates || [];
    this.bufferTimeBetweenAppointments = data.bufferTimeBetweenAppointments || 15;
    this.currentStatus = data.currentStatus || AvailabilityStatus.OFFLINE;

    this.reviews = data.reviews || [];
    this.averageRating = data.averageRating || 0;
    this.totalReviews = data.totalReviews || 0;

    this.verificationStatus = data.verificationStatus || VerificationStatus.PENDING;
    this.backgroundCheckCompleted = data.backgroundCheckCompleted || false;
    this.licenseVerified = data.licenseVerified || false;
    this.identityVerified = data.identityVerified || false;

    this.notificationSettings = data.notificationSettings || this.getDefaultNotificationSettings();
    this.policies = data.policies || this.getDefaultPolicies();
    this.isActive = data.isActive ?? true;
    this.isOnboarded = data.isOnboarded || false;

    this.bankAccountConnected = data.bankAccountConnected || false;
    this.totalEarnings = data.totalEarnings || 0;
    this.pendingPayouts = data.pendingPayouts || 0;
  }

  // Computed Properties
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  get isMobileService(): boolean {
    return this.serviceType === ServiceType.MOBILE_ONLY || this.serviceType === ServiceType.BOTH;
  }

  get hasShop(): boolean {
    return this.serviceType === ServiceType.SHOP || this.serviceType === ServiceType.BOTH;
  }

  get isFullyVerified(): boolean {
    return (
      this.verificationStatus === VerificationStatus.VERIFIED &&
      this.backgroundCheckCompleted &&
      this.licenseVerified &&
      this.identityVerified
    );
  }

  get canAcceptBookings(): boolean {
    return (
      this.isActive &&
      this.isOnboarded &&
      this.isFullyVerified &&
      this.services.length > 0 &&
      this.bankAccountConnected
    );
  }

  // Methods
  addService(service: Omit<Service, 'id'>): Service {
    const newService: Service = {
      ...service,
      id: this.generateId(),
    };
    this.services.push(newService);
    this.updatedAt = new Date();
    return newService;
  }

  removeService(serviceId: string): boolean {
    const index = this.services.findIndex((s) => s.id === serviceId);
    if (index > -1) {
      this.services.splice(index, 1);
      this.updatedAt = new Date();
      return true;
    }
    return false;
  }

  updateService(serviceId: string, updates: Partial<Service>): boolean {
    const service = this.services.find((s) => s.id === serviceId);
    if (service) {
      Object.assign(service, updates);
      this.updatedAt = new Date();
      return true;
    }
    return false;
  }

  setAvailability(
    dayOfWeek: number,
    startTime: string,
    endTime: string,
    isAvailable: boolean = true
  ): void {
    const existingIndex = this.weeklyAvailability.findIndex((a) => a.dayOfWeek === dayOfWeek);
    const availability: Availability = { dayOfWeek, startTime, endTime, isAvailable };

    if (existingIndex > -1) {
      this.weeklyAvailability[existingIndex] = availability;
    } else {
      this.weeklyAvailability.push(availability);
    }
    this.updatedAt = new Date();
  }

  blockDate(date: Date): void {
    if (!this.blockedDates.some((d) => d.getTime() === date.getTime())) {
      this.blockedDates.push(date);
      this.updatedAt = new Date();
    }
  }

  unblockDate(date: Date): void {
    this.blockedDates = this.blockedDates.filter((d) => d.getTime() !== date.getTime());
    this.updatedAt = new Date();
  }

  updateStatus(status: AvailabilityStatus): void {
    this.currentStatus = status;
    this.updatedAt = new Date();
  }

  addReview(review: Omit<Review, 'id'>): void {
    const newReview: Review = {
      ...review,
      id: this.generateId(),
    };
    this.reviews.push(newReview);
    this.recalculateRating();
    this.updatedAt = new Date();
  }

  getAvailableTimeSlots(date: Date, serviceDuration: number): TimeSlot[] {
    // Implementation would check availability, existing bookings, etc.
    // This is a simplified version
    const dayOfWeek = date.getDay();
    const availability = this.weeklyAvailability.find((a) => a.dayOfWeek === dayOfWeek);

    if (!availability || !availability.isAvailable) {
      return [];
    }

    // Would generate time slots based on availability, buffer times, existing bookings
    // This is just a placeholder structure
    return [];
  }

  calculateDistance(clientLocation: Location): number {
    if (!this.hasShop || !this.ShopInfo) {
      return 0;
    }
    // Implementation would calculate distance between barber and client
    // Using Haversine formula or similar
    return 0;
  }

  canServiceLocation(clientLocation: Location): boolean {
    if (!this.isMobileService || !this.mobileServiceInfo) {
      return this.hasShop;
    }

    const distance = this.calculateDistance(clientLocation);
    return distance <= this.mobileServiceInfo.serviceRadius;
  }

  private recalculateRating(): void {
    if (this.reviews.length === 0) {
      this.averageRating = 0;
      this.totalReviews = 0;
      return;
    }

    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.averageRating = Number((sum / this.reviews.length).toFixed(2));
    this.totalReviews = this.reviews.length;
  }

  private getDefaultAvailability(): Availability[] {
    // Default: Monday-Friday 9 AM to 5 PM
    return [
      { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', isAvailable: false },
      { dayOfWeek: 2, startTime: '09:00', endTime: '17:00', isAvailable: false },
      { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', isAvailable: false },
      { dayOfWeek: 4, startTime: '09:00', endTime: '17:00', isAvailable: false },
      { dayOfWeek: 5, startTime: '09:00', endTime: '17:00', isAvailable: false },
    ];
  }

  private getDefaultNotificationSettings(): NotificationSettings {
    return {
      newBookings: true,
      cancellations: true,
      reminders: true,
      promotions: false,
      pushEnabled: true,
      emailEnabled: true,
      smsEnabled: true,
    };
  }

  private getDefaultPolicies(): Policies {
    return {
      cancellationPolicy: 'Free cancellation up to 2 hours before appointment',
      noShowPolicy: '50% charge for no-shows',
      refundPolicy: 'Refunds processed within 5-7 business days',
      advanceBookingDays: 30,
      sameDayBooking: true,
    };
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Serialization
  toJSON(): object {
    return {
      id: this.id,
      email: this.email,
      phone: this.phone,
      firstName: this.firstName,
      lastName: this.lastName,
      profileImage: this.profileImage,
      serviceType: this.serviceType,
      services: this.services,
      mobileServiceInfo: this.mobileServiceInfo,
      homeStudioInfo: this.ShopInfo,
      profile: this.profile,
      weeklyAvailability: this.weeklyAvailability,
      currentStatus: this.currentStatus,
      averageRating: this.averageRating,
      totalReviews: this.totalReviews,
      verificationStatus: this.verificationStatus,
      isActive: this.isActive,
      canAcceptBookings: this.canAcceptBookings,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
