import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  RefreshControl,
  StyleSheet,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAtom } from 'jotai';
import { barberAtom } from '@/store/createdBarberAtom';

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth();
const currentDay = currentDate.getDate();

// Transaction interface
interface Transaction {
  id: string;
  type: 'booking' | 'tip' | 'bonus' | 'adjustment';
  clientName: string;
  serviceName: string;
  amount: number;
  commission: number;
  platformFee: number;
  netAmount: number;
  date: Date;
  status: 'completed' | 'pending' | 'processing';
  payoutId?: string;
}

// Payout interface
interface Payout {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  scheduledDate: Date;
  processedDate?: Date;
  transactionCount: number;
  bankAccount: string;
}

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: 'txn_1',
    type: 'booking',
    clientName: 'John Smith',
    serviceName: 'Haircut & Beard Trim',
    amount: 45.0,
    commission: 4.5,
    platformFee: 2.25,
    netAmount: 38.25,
    date: new Date(currentYear, currentMonth, currentDay, 10, 0),
    status: 'completed',
    payoutId: 'payout_1',
  },
  {
    id: 'txn_2',
    type: 'tip',
    clientName: 'John Smith',
    serviceName: 'Tip',
    amount: 10.0,
    commission: 0,
    platformFee: 0.5,
    netAmount: 9.5,
    date: new Date(currentYear, currentMonth, currentDay, 10, 0),
    status: 'completed',
    payoutId: 'payout_1',
  },
  {
    id: 'txn_3',
    type: 'booking',
    clientName: 'Mike Johnson',
    serviceName: 'Premium Haircut',
    amount: 35.0,
    commission: 3.5,
    platformFee: 1.75,
    netAmount: 29.75,
    date: new Date(currentYear, currentMonth, currentDay - 3, 14, 30),
    status: 'completed',
    payoutId: 'payout_1',
  },
  {
    id: 'txn_4',
    type: 'booking',
    clientName: 'David Wilson',
    serviceName: 'Beard Styling',
    amount: 25.0,
    commission: 2.5,
    platformFee: 1.25,
    netAmount: 21.25,
    date: new Date(currentYear, currentMonth, currentDay - 3, 16, 0),
    status: 'completed',
  },
  {
    id: 'txn_5',
    type: 'booking',
    clientName: 'Alex Brown',
    serviceName: 'Full Service Package',
    amount: 65.0,
    commission: 6.5,
    platformFee: 3.25,
    netAmount: 55.25,
    date: new Date(currentYear, currentMonth, 15, 11, 30),
    status: 'completed',
  },
  {
    id: 'txn_6',
    type: 'bonus',
    clientName: 'Platform',
    serviceName: 'New Barber Bonus',
    amount: 50.0,
    commission: 0,
    platformFee: 0,
    netAmount: 50.0,
    date: new Date(currentYear, currentMonth, 22, 9, 0),
    status: 'completed',
  },
];

const periodTabs = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
];

export default function PayoutsScreen() {
  const [barber] = useAtom(barberAtom);
  const [transactions] = useState<Transaction[]>(mockTransactions);

  const [selectedPeriod, setSelectedPeriod] = useState('weekly');
  const [refreshing, setRefreshing] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call to refresh data
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getEarningsForPeriod = () => {
    const now = new Date();
    let startDate: Date;

    switch (selectedPeriod) {
      case 'daily':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        console.log('Start Date for Daily:', startDate);
        break;
      case 'weekly':
        const dayOfWeek = now.getDay();
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);
        console.log('Start Date for Daily:', startDate);
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        console.log('Start Date for Daily:', startDate);
        break;
      default:
        startDate = new Date(0);
    }

    const periodTransactions = transactions.filter(
      (t) => t.date >= startDate && t.status === 'completed'
    );
    console.log('startDate:', startDate);
    console.log('Period Transactions:', periodTransactions.length);

    return {
      totalAmount: periodTransactions.reduce((sum, t) => sum + t.amount, 0),
      totalCommission: periodTransactions.reduce((sum, t) => sum + t.commission, 0),
      totalPlatformFee: periodTransactions.reduce((sum, t) => sum + t.platformFee, 0),
      netAmount: periodTransactions.reduce((sum, t) => sum + t.netAmount, 0),
      transactionCount: periodTransactions.length,
    };
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return 'cut';
      case 'tip':
        return 'heart';
      case 'bonus':
        return 'gift';
      case 'adjustment':
        return 'swap-horizontal';
      default:
        return 'cash';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const earnings = getEarningsForPeriod();

  const transactionsToShow = showAllTransactions ? transactions : transactions.slice(0, 5);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.content}>
          {/* Period Selector */}
          <View style={styles.periodSelector}>
            {periodTabs.map((period) => (
              <TouchableOpacity
                key={period.key}
                style={[styles.periodTab, selectedPeriod === period.key && styles.activePeriodTab]}
                onPress={() => setSelectedPeriod(period.key)}
              >
                <Text
                  style={[
                    styles.periodTabText,
                    selectedPeriod === period.key && styles.activePeriodTabText,
                  ]}
                >
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Earnings Overview */}
          <View style={styles.earningsCard}>
            <View style={styles.earningsHeader}>
              <Text style={styles.earningsTitle}>
                {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} Earnings
              </Text>
            </View>

            <View style={styles.earningsAmount}>
              <Text style={styles.netEarnings}>${earnings.netAmount.toFixed(2)}</Text>
              <Text style={styles.earningsSubtext}>
                from {earnings.transactionCount} service{earnings.transactionCount !== 1 ? 's' : ''}
              </Text>
            </View>

            <View style={styles.earningsBreakdown}>
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownLabel}>Gross Revenue</Text>
                <Text style={styles.breakdownValue}>${earnings.totalAmount.toFixed(2)}</Text>
              </View>
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownLabel}>Platform Fee</Text>
                <Text style={[styles.breakdownValue, { color: '#dc2626' }]}>
                  -${earnings.totalPlatformFee.toFixed(2)}
                </Text>
              </View>
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownLabel}>Commission</Text>
                <Text style={[styles.breakdownValue, { color: '#dc2626' }]}>
                  -${earnings.totalCommission.toFixed(2)}
                </Text>
              </View>
              <View style={[styles.breakdownItem, styles.breakdownTotal]}>
                <Text style={styles.breakdownTotalLabel}>Net Earnings</Text>
                <Text style={styles.breakdownTotalValue}>${earnings.netAmount.toFixed(2)}</Text>
              </View>
            </View>
          </View>

          {/* Transaction History */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Transaction History</Text>
              <TouchableOpacity onPress={() => setShowAllTransactions(!showAllTransactions)}>
                <Text style={styles.viewAllText}>
                  {showAllTransactions ? 'Show Less' : 'View All'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.transactionsList}>
              {transactionsToShow.map((transaction) => (
                <View key={transaction.id} style={styles.transactionCard}>
                  <View style={styles.transactionHeader}>
                    <View style={styles.transactionIcon}>
                      <Ionicons
                        name={getTransactionIcon(transaction.type)}
                        size={20}
                        color="#dc2626"
                      />
                    </View>
                    <View style={styles.transactionInfo}>
                      <Text style={styles.transactionClient}>{transaction.clientName}</Text>
                      <Text style={styles.transactionService}>{transaction.serviceName}</Text>
                      <Text style={styles.transactionDate}>
                        {formatDate(transaction.date)} at {formatTime(transaction.date)}
                      </Text>
                    </View>
                    <View style={styles.transactionAmounts}>
                      <Text style={styles.transactionGross}>${transaction.amount.toFixed(2)}</Text>
                      <Text style={styles.transactionNet}>
                        ${transaction.netAmount.toFixed(2)} net
                      </Text>
                    </View>
                  </View>

                  {/* Breakdown */}
                  <View style={styles.transactionBreakdown}>
                    <View style={styles.breakdownRow}>
                      <Text style={styles.breakdownRowLabel}>Service Amount</Text>
                      <Text style={styles.breakdownRowValue}>${transaction.amount.toFixed(2)}</Text>
                    </View>
                    {transaction.commission > 0 && (
                      <View style={styles.breakdownRow}>
                        <Text style={styles.breakdownRowLabel}>Commission (10%)</Text>
                        <Text style={[styles.breakdownRowValue, { color: '#dc2626' }]}>
                          -${transaction.commission.toFixed(2)}
                        </Text>
                      </View>
                    )}
                    {transaction.platformFee > 0 && (
                      <View style={styles.breakdownRow}>
                        <Text style={styles.breakdownRowLabel}>Platform Fee</Text>
                        <Text style={[styles.breakdownRowValue, { color: '#dc2626' }]}>
                          -${transaction.platformFee.toFixed(2)}
                        </Text>
                      </View>
                    )}
                    <View style={[styles.breakdownRow, styles.breakdownRowTotal]}>
                      <Text style={styles.breakdownRowTotalLabel}>You Earned</Text>
                      <Text style={styles.breakdownRowTotalValue}>
                        ${transaction.netAmount.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  exportButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  periodTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activePeriodTab: {
    backgroundColor: '#dc2626',
  },
  periodTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  activePeriodTabText: {
    color: '#ffffff',
  },
  earningsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  earningsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  earningsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  earningsAmount: {
    alignItems: 'center',
    marginBottom: 24,
  },
  netEarnings: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  earningsSubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  earningsBreakdown: {
    gap: 12,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  breakdownTotal: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
    marginTop: 12,
  },
  breakdownTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  breakdownTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dc2626',
  },
  payoutCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  payoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  payoutInfo: {
    flex: 1,
  },
  payoutAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  payoutDetails: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  payoutStatus: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  payoutStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  payoutFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 12,
  },
  payoutDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  payoutDateText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
  transactionsList: {
    gap: 16,
  },
  transactionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#fef2f2',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionClient: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  transactionService: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  transactionAmounts: {
    alignItems: 'flex-end',
  },
  transactionGross: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  transactionNet: {
    fontSize: 14,
    color: '#16a34a',
    marginTop: 2,
  },
  transactionBreakdown: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownRowLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  breakdownRowValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  breakdownRowTotal: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 8,
    marginTop: 4,
  },
  breakdownRowTotalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  breakdownRowTotalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 16,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#f3f4f6',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryStatItem: {
    alignItems: 'center',
  },
  summaryStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  summaryStatLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
});
