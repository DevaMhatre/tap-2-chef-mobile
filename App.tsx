import React, { useState, useEffect } from 'react';
import { 
  SafeAreaView, StyleSheet, Text, View, FlatList, 
  TouchableOpacity, StatusBar, TextInput, Alert, ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';
import { DatabaseProvider, useDatabase } from '@nozbe/watermelondb/react';
import withObservables from '@nozbe/with-observables';
import { Q } from '@nozbe/watermelondb';
import { database } from './model/index';

// --- STYLES (Premium Aesthetics) ---
const colors = {
  background: '#F4F7F6',
  surface: '#FFFFFF',
  primary: '#E63946',
  primaryDark: '#D62828',
  secondary: '#457B9D',
  textHeader: '#1D3557',
  textSecondary: '#6C757D',
  border: '#E9ECEF',
  accent: '#A8DADC',
  cardShadow: 'rgba(0,0,0,0.06)',
  success: '#2A9D8F'
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 40 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
    zIndex: 10,
  },
  headerTopInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: { fontSize: 24, fontWeight: '800', color: colors.textHeader, letterSpacing: -0.5 },
  seedButton: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  seedButtonText: { color: colors.surface, fontSize: 13, fontWeight: '700' },
  
  // Profile Selector
  profilePill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  profilePillActive: {
    backgroundColor: colors.textHeader,
    borderColor: colors.textHeader,
  },
  profileText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  profileTextActive: { color: colors.surface },

  // Category Selector
  categoryContainer: {
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  categoryPill: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.surface,
    marginHorizontal: 5,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryPillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  categoryText: { fontSize: 15, fontWeight: '700', color: colors.textHeader },
  categoryTextActive: { color: colors.surface },

  // Item Grid & Card
  gridContainer: { paddingHorizontal: 10, paddingBottom: 120 },
  itemCard: {
    flex: 1,
    margin: 10,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    minHeight: 140,
    justifyContent: 'space-between',
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  itemName: { fontSize: 16, fontWeight: '700', color: colors.textHeader, marginBottom: 8, lineHeight: 22 },
  itemPrice: { fontSize: 17, fontWeight: '800', color: colors.primary },
  
  // Bottom Action Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 35,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: colors.textHeader,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cartInfoText: { fontSize: 13, fontWeight: '700', color: colors.textSecondary, marginBottom: 12, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1 },
  fireButton: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  fireButtonText: { color: colors.surface, fontSize: 18, fontWeight: '800', letterSpacing: 1 },
  emptyState: { textAlign: 'center', marginTop: 60, color: colors.textSecondary, fontSize: 16, fontStyle: 'italic' },
  
  // Top Toggle
  toggleContainer: { flexDirection: 'row', backgroundColor: colors.background, padding: 4, borderRadius: 12, marginBottom: 15 },
  toggleBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8, marginHorizontal: 2 },
  toggleBtnActive: { backgroundColor: colors.surface, shadowColor: colors.cardShadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 4, elevation: 2 },
  toggleText: { fontSize: 11, fontWeight: '800', color: colors.textSecondary, textTransform: 'uppercase' },
  toggleTextActive: { color: colors.textHeader },
  
  // Order Card
  orderCard: { backgroundColor: colors.surface, padding: 18, borderRadius: 16, marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: colors.cardShadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 10, elevation: 3, borderWidth: 1, borderColor: colors.border },
  orderIdText: { fontSize: 16, fontWeight: '900', color: colors.primaryDark, marginBottom: 6 },
  orderTotalText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  servedButton: { backgroundColor: colors.success, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12 },
  servedButtonText: { color: colors.surface, fontSize: 14, fontWeight: '700' },

  // Settlement UI
  settlementContainer: { backgroundColor: colors.surface, padding: 20, borderRadius: 20, margin: 15, elevation: 5, shadowColor: colors.cardShadow, shadowOpacity: 1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  settleHeader: { fontSize: 22, fontWeight: '800', color: colors.textHeader, marginBottom: 20, textAlign: 'center' },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  inputLabel: { flex: 1, fontSize: 16, fontWeight: '700', color: colors.textSecondary },
  textInput: { flex: 2, borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 12, fontSize: 18, color: colors.textHeader, backgroundColor: colors.background },
  confirmSettleButton: { backgroundColor: colors.success, padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  cancelBtn: { backgroundColor: colors.textSecondary, padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  
  // Dashboard Styles
  dashContainer: { flex: 1, padding: 20 },
  dashCardMain: { backgroundColor: colors.textHeader, padding: 30, borderRadius: 24, marginBottom: 15, alignItems: 'center', shadowColor: colors.textHeader, shadowOpacity: 0.3, shadowRadius: 15, shadowOffset: { width: 0, height: 8 }, elevation: 6 },
  dashTitleMain: { color: colors.accent, fontSize: 14, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 },
  dashAmountMain: { color: colors.surface, fontSize: 44, fontWeight: '900' },
  
  dashRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dashCardHalf: { flex: 0.48, backgroundColor: colors.surface, padding: 20, borderRadius: 20, alignItems: 'center', shadowColor: colors.cardShadow, shadowOpacity: 1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 3, borderWidth: 1, borderColor: colors.border },
  dashTitleSub: { color: colors.textSecondary, fontSize: 12, fontWeight: '800', textTransform: 'uppercase', marginBottom: 8, textAlign: 'center' },
  dashAmountCash: { color: colors.success, fontSize: 22, fontWeight: '800' },
  dashAmountUpi: { color: colors.primary, fontSize: 22, fontWeight: '800' },
  
  dashCardSmall: { backgroundColor: colors.surface, padding: 20, borderRadius: 20, marginTop: 15, alignItems: 'center', shadowColor: colors.cardShadow, shadowOpacity: 1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 3, borderWidth: 1, borderColor: colors.border },
  dashAmountInfo: { color: colors.textHeader, fontSize: 32, fontWeight: '900' },

  // Auth Styles
  authContainer: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', padding: 20 },
  authCard: { backgroundColor: colors.surface, padding: 35, borderRadius: 24, shadowColor: colors.textHeader, shadowOpacity: 0.1, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 5 },
  authTitle: { fontSize: 28, fontWeight: '900', color: colors.textHeader, marginBottom: 8, textAlign: 'center' },
  authSubtitle: { fontSize: 16, color: colors.textSecondary, marginBottom: 35, textAlign: 'center' },
  inputStack: { marginBottom: 20 },
  textInputFull: { borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 16, fontSize: 16, color: colors.textHeader, backgroundColor: colors.background },
  primaryAuthBtn: { backgroundColor: colors.primary, paddingVertical: 18, borderRadius: 14, alignItems: 'center', marginTop: 15, shadowColor: colors.primary, shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  primaryAuthBtnText: { color: colors.surface, fontSize: 18, fontWeight: '800' },
  authFooterLink: { marginTop: 25, alignItems: 'center', paddingVertical: 10 },
  authFooterText: { color: colors.textSecondary, fontSize: 15, fontWeight: '600' },
});

// --- ENHANCED COMPONENTS WITH TENANT ISOLATION ---

// 0. Table Grid (Dine-In Management)
const TableGridList = ({ maxTables, activeOrders, onSelectTable }: any) => {
  const TABLE_NUMBERS = Array.from({ length: maxTables || 12 }, (_, i) => (i + 1).toString());

  return (
    <View style={{flex: 1, padding: 15}}>
      <Text style={[styles.settleHeader, {textAlign: 'left', marginBottom: 15}]}>Dine-In Tables</Text>
      <FlatList
        data={TABLE_NUMBERS}
        numColumns={3}
        keyExtractor={item => item}
        renderItem={({ item }) => {
          const occupiedOrder = activeOrders.find((o: any) => o.tableNumber === item);
          const isOccupied = !!occupiedOrder;

          return (
            <TouchableOpacity 
              style={[
                {flex: 1, margin: 8, height: 100, borderRadius: 16, padding: 12, justifyContent: 'center', alignItems: 'center'},
                isOccupied 
                  ? {backgroundColor: colors.primary, shadowColor: colors.primary, elevation: 4}
                  : {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border}
              ]}
              activeOpacity={0.8}
              onPress={() => onSelectTable(item, occupiedOrder || null)}
            >
              <Text style={{fontSize: 24, fontWeight: '900', color: isOccupied ? colors.surface : colors.textHeader}}>
                {item}
              </Text>
              <Text style={{fontSize: 12, fontWeight: '700', color: isOccupied ? colors.surface : colors.textSecondary, marginTop: 4}}>
                {isOccupied ? `$${occupiedOrder.totalAmount.toFixed(2)}` : 'Available'}
              </Text>
            </TouchableOpacity>
          )
        }}
      />
    </View>
  );
};
const EnhancedTableGrid = withObservables(['activeTenant'], ({ activeTenant }: any) => ({
  activeOrders: database.get('orders').query(
    Q.where('tenant_id', activeTenant),
    Q.where('status', Q.oneOf(['cooking', 'served']))
  ).observe(),
}))(TableGridList);


// 1. Profile Selector
const ProfileSelectorList = ({ profiles, selectedId, onSelect }: any) => {
  if (!profiles || profiles.length === 0) return <Text style={{color: colors.textSecondary}}>No Profiles Found</Text>;
  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={profiles}
      keyExtractor={item => item.id}
      renderItem={({ item }) => {
        const isActive = selectedId === item.id;
        return (
          <TouchableOpacity 
            style={[styles.profilePill, isActive && styles.profilePillActive]}
            onPress={() => onSelect(item.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.profileText, isActive && styles.profileTextActive]}>{item.name}</Text>
          </TouchableOpacity>
        )
      }}
    />
  );
};
const EnhancedProfileSelector = withObservables(['activeTenant'], ({ activeTenant }: any) => ({
  profiles: database.get('menu_profiles').query(Q.where('tenant_id', activeTenant)).observe(),
}))(ProfileSelectorList);


// 2. Category Selector
const CategorySelectorList = ({ categories, selectedId, onSelect }: any) => {
  if (!categories || categories.length === 0) return <Text style={{marginLeft: 20, color: colors.textSecondary}}>No categories mapping found.</Text>;
  useEffect(() => {
    if (!selectedId && categories.length > 0) {
      onSelect(categories[0].id);
    }
  }, [categories, selectedId, onSelect]);
  return (
    <View style={styles.categoryContainer}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const isActive = selectedId === item.id;
          return (
            <TouchableOpacity 
              style={[styles.categoryPill, isActive && styles.categoryPillActive]}
              onPress={() => onSelect(item.id)}
              activeOpacity={0.8}
            >
              <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>{item.name}</Text>
            </TouchableOpacity>
          )
        }}
      />
    </View>
  )
};
const EnhancedCategorySelector = withObservables(['profileId', 'activeTenant'], ({ profileId, activeTenant }: any) => ({
  categories: database.get('categories').query(
    Q.where('menu_profile_id', profileId || ''),
    Q.where('tenant_id', activeTenant)
  ).observe(),
}))(CategorySelectorList);


// 3. Item Base Card
const ItemCard = ({ item, onPress }: any) => (
  <TouchableOpacity style={styles.itemCard} activeOpacity={0.7} onPress={() => onPress && onPress(item)}>
    <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
    <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
  </TouchableOpacity>
);

const EnhancedItemCard = withObservables(['item'], ({ item }: any) => ({
  item,
}))(ItemCard);


// 4. Item Grid
const ItemGridList = ({ items, onItemPress }: any) => {
  if (!items || items.length === 0) return <Text style={styles.emptyState}>No items available for this category.</Text>;
  return (
    <FlatList
      data={items}
      numColumns={2}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.gridContainer}
      renderItem={({ item }) => <EnhancedItemCard item={item} onPress={onItemPress} />}
    />
  )
};
const EnhancedItemGrid = withObservables(['categoryId', 'activeTenant'], ({ categoryId, activeTenant }: any) => ({
  items: database.get('items').query(
    Q.where('category_id', categoryId || ''),
    Q.where('tenant_id', activeTenant)
  ).observe(),
}))(ItemGridList);


// 5. Active Orders
const OrderCard = ({ order }: any) => {
  const db = useDatabase();
  const handleMarkServed = async () => {
    await db.write(async () => {
      await order.update((o: any) => {
        o.status = 'served';
      });
    });
  };

  return (
    <View style={styles.orderCard}>
      <View>
        <Text style={styles.orderIdText}>
          {order.tableNumber ? `TABLE ${order.tableNumber}` : `ORDER #${order.id.substring(0, 4).toUpperCase()}`}
        </Text>
        <Text style={styles.orderTotalText}>Total: ${order.totalAmount.toFixed(2)}</Text>
      </View>
      <TouchableOpacity style={styles.servedButton} onPress={handleMarkServed} activeOpacity={0.8}>
        <Text style={styles.servedButtonText}>Mark Served</Text>
      </TouchableOpacity>
    </View>
  );
};

const EnhancedOrderCard = withObservables(['order'], ({ order }: any) => ({
  order,
}))(OrderCard);

const ActiveOrdersView = ({ orders }: any) => {
  if (!orders || orders.length === 0) return <Text style={styles.emptyState}>No active orders currently cooking.</Text>;
  return (
    <FlatList
      data={orders}
      keyExtractor={item => item.id}
      contentContainerStyle={{ padding: 15, paddingBottom: 100 }}
      renderItem={({ item }) => <EnhancedOrderCard order={item} />}
    />
  );
};
const EnhancedActiveOrders = withObservables(['activeTenant'], ({ activeTenant }: any) => ({
  orders: database.get('orders').query(
    Q.where('status', 'cooking'),
    Q.where('tenant_id', activeTenant),
    Q.sortBy('created_at', Q.asc)
  ).observe(),
}))(ActiveOrdersView);


// 6. Billing Queue & Settlement Flow
const SettlementView = ({ order, onCancel, onSettle }: any) => {
  const [cashAmount, setCashAmount] = useState<string>('');
  const [upiAmount, setUpiAmount] = useState<string>(order.totalAmount.toString());

  const handleCashChange = (text: string) => {
    setCashAmount(text);
    const parsedCash = parseFloat(text) || 0;
    const remaining = Math.max(0, order.totalAmount - parsedCash);
    setUpiAmount(remaining.toFixed(2).replace(/\.00$/, '')); 
  };

  const handleUpiChange = (text: string) => {
    setUpiAmount(text);
    const parsedUpi = parseFloat(text) || 0;
    const remaining = Math.max(0, order.totalAmount - parsedUpi);
    setCashAmount(remaining.toFixed(2).replace(/\.00$/, ''));
  };

  return (
    <View style={styles.settlementContainer}>
      <Text style={styles.settleHeader}>
        Settle {order.tableNumber ? `Table ${order.tableNumber}` : `Order #${order.id.substring(0,4).toUpperCase()}`}
      </Text>
      <Text style={[styles.settleHeader, { color: colors.primary, fontSize: 26 }]}>Total: ${order.totalAmount.toFixed(2)}</Text>
      
      <View style={styles.inputRow}>
        <Text style={styles.inputLabel}>CASH Amount:</Text>
        <TextInput 
          style={styles.textInput} 
          keyboardType="numeric" 
          value={cashAmount} 
          onChangeText={handleCashChange} 
          placeholder="0.00"
        />
      </View>
      <View style={styles.inputRow}>
        <Text style={styles.inputLabel}>UPI Amount:</Text>
        <TextInput 
          style={styles.textInput} 
          keyboardType="numeric" 
          value={upiAmount} 
          onChangeText={handleUpiChange}
          placeholder="0.00"
        />
      </View>

      <TouchableOpacity 
        style={styles.confirmSettleButton} 
        activeOpacity={0.8}
        onPress={() => onSettle(parseFloat(cashAmount) || 0, parseFloat(upiAmount) || 0)}
      >
        <Text style={styles.servedButtonText}>Confirm Payment</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelBtn} activeOpacity={0.8} onPress={onCancel}>
        <Text style={styles.servedButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const BillingCard = ({ order, onSelect }: any) => {
  return (
    <View style={styles.orderCard}>
      <View>
        <Text style={styles.orderIdText}>
          {order.tableNumber ? `TABLE ${order.tableNumber}` : `Order #${order.id.substring(0, 4).toUpperCase()}`}
        </Text>
        <Text style={styles.orderTotalText}>Total: ${order.totalAmount.toFixed(2)}</Text>
      </View>
      <TouchableOpacity style={styles.servedButton} onPress={() => onSelect(order)} activeOpacity={0.8}>
        <Text style={styles.servedButtonText}>Settle Bill</Text>
      </TouchableOpacity>
    </View>
  );
};

const EnhancedBillingCard = withObservables(['order'], ({ order }: any) => ({
  order,
}))(BillingCard);

const PendingBillsList = ({ orders }: any) => {
  const db = useDatabase();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const handleFinalizePayment = async (cashAmount: number, upiAmount: number) => {
    if (!selectedOrder) return;
    await db.write(async () => {
      await selectedOrder.update((o: any) => {
        o.status = 'settled';
        o.cashAmount = cashAmount;
        o.upiAmount = upiAmount;
      });
    });
    setSelectedOrder(null);
  };

  if (selectedOrder) {
    return <SettlementView order={selectedOrder} onCancel={() => setSelectedOrder(null)} onSettle={handleFinalizePayment} />;
  }

  if (!orders || orders.length === 0) return <Text style={styles.emptyState}>No pending bills to settle.</Text>;

  return (
    <FlatList
      data={orders}
      keyExtractor={item => item.id}
      contentContainerStyle={{ padding: 15, paddingBottom: 100 }}
      renderItem={({ item }) => <EnhancedBillingCard order={item} onSelect={setSelectedOrder} />}
    />
  );
};

const EnhancedPendingBills = withObservables(['activeTenant'], ({ activeTenant }: any) => ({
  orders: database.get('orders').query(
    Q.where('status', 'served'),
    Q.where('tenant_id', activeTenant),
    Q.sortBy('created_at', Q.asc)
  ).observe(),
}))(PendingBillsList);


// 7. Expense Tracker
const ExpenseCard = ({ expense }: any) => (
  <View style={styles.orderCard}>
    <View>
      <Text style={styles.orderIdText}>{expense.tag}</Text>
      <Text style={styles.orderTotalText}>via {expense.paymentSource}</Text>
    </View>
    <Text style={[styles.orderTotalText, {color: colors.primary, fontWeight: '800', fontSize: 16}]}>
      -${expense.amount.toFixed(2)}
    </Text>
  </View>
);

const EnhancedExpenseCard = withObservables(['expense'], ({ expense }: any) => ({
  expense,
}))(ExpenseCard);

const ExpensesList = ({ expenses }: any) => {
  if (!expenses || expenses.length === 0) return <Text style={styles.emptyState}>No expenses logged today.</Text>;
  return (
    <FlatList
      data={expenses}
      keyExtractor={item => item.id}
      contentContainerStyle={{ padding: 15, paddingBottom: 100 }}
      renderItem={({ item }) => <EnhancedExpenseCard expense={item} />}
    />
  );
};
const EnhancedExpensesList = withObservables(['activeTenant'], ({ activeTenant }: any) => ({
  expenses: database.get('expenses').query(
    Q.where('tenant_id', activeTenant),
    Q.sortBy('created_at', Q.desc)
  ).observe(),
}))(ExpensesList);

const ExpenseTracker = ({ activeTenant }: { activeTenant: string }) => {
  const db = useDatabase();
  const [amount, setAmount] = useState<string>('');
  const [tag, setTag] = useState<string>('');
  const [paymentSource, setPaymentSource] = useState<'CASH' | 'UPI'>('CASH');

  const handleLogExpense = async () => {
    const val = parseFloat(amount);
    if (!val || val <= 0 || !tag.trim()) return;

    await db.write(async () => {
      await db.get('expenses').create((exp: any) => {
        exp.tenantId = activeTenant;
        exp.amount = val;
        exp.tag = tag.trim();
        exp.paymentSource = paymentSource;
      });
    });

    setAmount('');
    setTag('');
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.settlementContainer}>
        <Text style={styles.settleHeader}>Log Expense</Text>
        
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Amount:</Text>
          <TextInput 
            style={styles.textInput} 
            keyboardType="numeric" 
            value={amount} 
            onChangeText={setAmount} 
            placeholder="0.00"
          />
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Reason / Tag:</Text>
          <TextInput 
            style={styles.textInput} 
            value={tag} 
            onChangeText={setTag}
            placeholder="e.g. Vegetables"
          />
        </View>

        <View style={{flexDirection: 'row', marginTop: 10, justifyContent: 'center'}}>
          <TouchableOpacity 
            style={[
              styles.toggleBtn, 
              {borderWidth: 1, paddingVertical: 12},
              paymentSource === 'CASH' ? {backgroundColor: colors.primary, borderColor: colors.primary} : {backgroundColor: 'transparent', borderColor: colors.border}
            ]} 
            onPress={() => setPaymentSource('CASH')}
            activeOpacity={0.8}
          >
            <Text style={[styles.toggleText, paymentSource === 'CASH' ? {color: colors.surface, fontSize: 13} : null]}>CASH</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.toggleBtn, 
              {borderWidth: 1, paddingVertical: 12},
              paymentSource === 'UPI' ? {backgroundColor: colors.primary, borderColor: colors.primary} : {backgroundColor: 'transparent', borderColor: colors.border}
            ]} 
            onPress={() => setPaymentSource('UPI')}
            activeOpacity={0.8}
          >
            <Text style={[styles.toggleText, paymentSource === 'UPI' ? {color: colors.surface, fontSize: 13} : null]}>UPI</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.confirmSettleButton} 
          activeOpacity={0.8}
          onPress={handleLogExpense}
        >
          <Text style={styles.servedButtonText}>Log Expense</Text>
        </TouchableOpacity>
      </View>
      
      <View style={{flex: 1}}>
        <EnhancedExpensesList activeTenant={activeTenant} />
      </View>
    </View>
  );
};


// 8. Analytics Dashboard
const RevenueDashboard = ({ settledOrders, expenses }: any) => {
  const totalOrders = settledOrders.length;
  const grossSales = settledOrders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);
  const totalCashIn = settledOrders.reduce((sum: number, o: any) => sum + (o.cashAmount || 0), 0);
  const totalUpiIn = settledOrders.reduce((sum: number, o: any) => sum + (o.upiAmount || 0), 0);
  
  const cashExpenses = expenses
    .filter((e: any) => e.paymentSource === 'CASH')
    .reduce((sum: number, e: any) => sum + (e.amount || 0), 0);

  const upiExpenses = expenses
    .filter((e: any) => e.paymentSource === 'UPI')
    .reduce((sum: number, e: any) => sum + (e.amount || 0), 0);

  const totalExpenses = cashExpenses + upiExpenses;

  const netCash = Math.max(0, totalCashIn - cashExpenses);
  const netUpi = Math.max(0, totalUpiIn - upiExpenses);
  const totalNetRevenue = netCash + netUpi;
  
  return (
    <View style={styles.dashContainer}>
      <View style={styles.dashCardMain}>
        <Text style={styles.dashTitleMain}>Total Net Revenue</Text>
        <Text style={styles.dashAmountMain}>${totalNetRevenue.toFixed(2)}</Text>
      </View>
      
      <View style={styles.dashRow}>
        <View style={styles.dashCardHalf}>
          <Text style={styles.dashTitleSub}>Net Cash</Text>
          <Text style={styles.dashAmountCash}>${netCash.toFixed(2)}</Text>
        </View>
        <View style={styles.dashCardHalf}>
          <Text style={styles.dashTitleSub}>Net UPI</Text>
          <Text style={styles.dashAmountUpi}>${netUpi.toFixed(2)}</Text>
        </View>
      </View>
      
      <View style={[styles.dashCardSmall, {marginTop: 15}]}>
        <Text style={[styles.dashTitleSub, {color: colors.primaryDark, marginBottom: 4}]}>Gross Sales: ${grossSales.toFixed(2)}</Text>
        <Text style={[styles.dashTitleSub, {color: colors.primaryDark, marginBottom: 0}]}>Total Expenses: ${totalExpenses.toFixed(2)}</Text>
      </View>

      <View style={styles.dashCardSmall}>
        <Text style={styles.dashTitleSub}>Total Orders Completed</Text>
        <Text style={styles.dashAmountInfo}>{totalOrders}</Text>
      </View>
    </View>
  );
};

const EnhancedRevenueDashboard = withObservables(['activeTenant'], ({ activeTenant }: any) => ({
  settledOrders: database.get('orders').query(
    Q.where('status', 'settled'),
    Q.where('tenant_id', activeTenant)
  ).observe(),
  expenses: database.get('expenses').query(
    Q.where('tenant_id', activeTenant)
  ).observe(),
}))(RevenueDashboard);


// --- MENU BUILDER ---
const MenuBuilderView = ({ activeTenant, selectedProfileId }: any) => {
  const db = useDatabase();
  const [newCatName, setNewCatName] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [isVeg, setIsVeg] = useState(true);

  const handleAddCategory = async () => {
    if (!newCatName.trim() || !selectedProfileId) {
      Alert.alert('Hold Up', 'Please enter a valid category name.');
      return;
    }
    await db.write(async () => {
      const profile = await db.get('menu_profiles').find(selectedProfileId);
      await db.get('categories').create((c: any) => {
        c.tenantId = activeTenant;
        c.name = newCatName.trim();
        c.menuProfile.set(profile);
      });
    });
    setNewCatName('');
  };

  const handleSaveItem = async () => {
    const val = parseFloat(newItemPrice);
    if (!activeCategoryId) {
      Alert.alert('Missing Category', 'Please create and select a destination Category first.');
      return;
    }
    if (!newItemName.trim() || !val || val <= 0) {
      Alert.alert('Invalid Item', 'Please enter a valid item name and numerical price.');
      return;
    }

    await db.write(async () => {
      const category = await db.get('categories').find(activeCategoryId);
      await db.get('items').create((i: any) => {
        i.tenantId = activeTenant;
        i.name = newItemName.trim();
        i.price = val;
        i.isOutOfStock = false;
        i.isVeg = isVeg;
        i.category.set(category);
      });
    });
    setNewItemName('');
    setNewItemPrice('');
    Alert.alert('Success', 'Item saved to database!');
  };

  if (!selectedProfileId) return <Text style={styles.emptyState}>No Menu Profile configured yet.</Text>;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }} keyboardShouldPersistTaps="handled">
        {/* CATEGORY FORM */}
        <View style={[styles.settlementContainer, { margin: 0, marginBottom: 20 }]}>
          <Text style={[styles.settleHeader, { fontSize: 18, marginBottom: 15 }]}>1. Add Category</Text>
          <View style={styles.inputRow}>
             <TextInput style={[styles.textInputFull, {flex: 1}]} value={newCatName} onChangeText={setNewCatName} placeholder="E.g. Starters" />
          </View>
          <TouchableOpacity style={[styles.primaryAuthBtn, { marginTop: 0, paddingVertical: 14 }]} onPress={handleAddCategory} activeOpacity={0.8}>
             <Text style={[styles.primaryAuthBtnText, { fontSize: 16 }]}>+ Create Category</Text>
          </TouchableOpacity>
        </View>

        {/* ITEM FORM */}
        <View style={[styles.settlementContainer, { margin: 0 }]}>
          <Text style={[styles.settleHeader, { fontSize: 18, marginBottom: 5 }]}>2. Add Menu Item</Text>
          <Text style={[styles.inputLabel, {marginBottom: 10}]}>Select Destination Category:</Text>
          <View style={{ marginLeft: -15, marginRight: -15, marginBottom: 15 }}>
            <EnhancedCategorySelector profileId={selectedProfileId} activeTenant={activeTenant} selectedId={activeCategoryId} onSelect={setActiveCategoryId} />
          </View>

          <View style={styles.inputRow}>
             <TextInput style={[styles.textInputFull, {flex: 1}]} value={newItemName} onChangeText={setNewItemName} placeholder="Item Name (e.g. Samosa)" />
          </View>
          <View style={styles.inputRow}>
             <TextInput style={[styles.textInputFull, {flex: 1}]} keyboardType="numeric" value={newItemPrice} onChangeText={setNewItemPrice} placeholder="Price (0.00)" />
          </View>
          
          <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 5, marginBottom: 10}}>
             <TouchableOpacity 
               style={[styles.toggleBtn, {borderWidth: 1, paddingVertical: 12}, isVeg ? {backgroundColor: colors.success, borderColor: colors.success} : {backgroundColor: 'transparent', borderColor: colors.border}]}
               onPress={() => setIsVeg(true)}
             >
               <Text style={[styles.toggleText, isVeg ? {color: colors.surface, fontSize: 13} : null]}>VEG</Text>
             </TouchableOpacity>
             <TouchableOpacity 
               style={[styles.toggleBtn, {borderWidth: 1, paddingVertical: 12}, !isVeg ? {backgroundColor: colors.primary, borderColor: colors.primary} : {backgroundColor: 'transparent', borderColor: colors.border}]}
               onPress={() => setIsVeg(false)}
             >
               <Text style={[styles.toggleText, !isVeg ? {color: colors.surface, fontSize: 13} : null]}>NON-VEG</Text>
             </TouchableOpacity>
          </View>

          <TouchableOpacity style={[styles.confirmSettleButton, { paddingVertical: 14 }]} onPress={handleSaveItem} activeOpacity={0.8}>
            <Text style={styles.servedButtonText}>Save Item to Category</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};


// --- MAIN POS PORTAL ---
const MainPosScreen = ({ activeTenant, settings }: { activeTenant: string, settings: any }) => {
  const db = useDatabase();
  const [activeView, setActiveView] = useState<'menu' | 'queue' | 'billing' | 'expenses' | 'dashboard' | 'builder'>('menu');
  
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [activeAppendOrder, setActiveAppendOrder] = useState<any>(null);

  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [cart, setCart] = useState<{item: any, quantity: number}[]>([]);

  useEffect(() => {
    const initProfiles = async () => {
      const profiles = await db.get('menu_profiles').query(
        Q.where('tenant_id', activeTenant)
      ).fetch();
      if (profiles.length > 0 && !selectedProfileId) {
        setSelectedProfileId(profiles[0].id);
      }
    };
    initProfiles();
  }, [db, selectedProfileId, activeTenant]);

  const handleSeedData = async () => {
    await db.write(async () => {
      const newProfile = await db.get('menu_profiles').create((profile: any) => {
        profile.tenantId = activeTenant;
        profile.name = 'Dine-In ' + Math.floor(Math.random() * 100);
        profile.isActive = true;
      });

      const catStarters = await db.get('categories').create((c: any) => {
        c.tenantId = activeTenant;
        c.name = 'Starters';
        c.menuProfile.set(newProfile);
      });
      const catMains = await db.get('categories').create((c: any) => {
        c.tenantId = activeTenant;
        c.name = 'Mains';
        c.menuProfile.set(newProfile);
      });

      await db.get('items').create((i: any) => { i.tenantId = activeTenant; i.name = 'Paneer Tikka'; i.price = 12.99; i.isOutOfStock = false; i.category.set(catStarters); });
      await db.get('items').create((i: any) => { i.tenantId = activeTenant; i.name = 'Samosa Chaat'; i.price = 8.50; i.isOutOfStock = false; i.category.set(catStarters); });
      await db.get('items').create((i: any) => { i.tenantId = activeTenant; i.name = 'Chicken Biryani'; i.price = 18.99; i.isOutOfStock = false; i.category.set(catMains); });
      await db.get('items').create((i: any) => { i.tenantId = activeTenant; i.name = 'Garlic Naan'; i.price = 4.00; i.isOutOfStock = false; i.category.set(catMains); });

      setSelectedProfileId(newProfile.id);
      setSelectedCategoryId(catStarters.id);
    });
  };

  const handleAddToCart = (item: any) => {
    setCart(prevCart => {
      const existing = prevCart.find(i => i.item.id === item.id);
      if (existing) {
        return prevCart.map(i => i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prevCart, { item, quantity: 1 }];
    });
  };

  const handleFireKOT = async () => {
    if (cart.length === 0) return;
    
    const cartTotal = cart.reduce((sum, cartItem) => sum + (cartItem.item.price * cartItem.quantity), 0);
    
    await db.write(async () => {
      let activeOrderRecord = activeAppendOrder;

      if (!activeOrderRecord) {
        // Create new table order
        activeOrderRecord = await db.get('orders').create((order: any) => {
          order.tenantId = activeTenant;
          order.tableNumber = selectedTable; // Can be null if it's off-table
          order.totalAmount = cartTotal;
          order.cashAmount = 0;
          order.upiAmount = 0;
          order.status = 'cooking';
        });
      } else {
        // Update existing table order mathematically
        await activeOrderRecord.update((order: any) => {
          order.totalAmount += cartTotal;
          // Reactivate it to the kitchen if it was served!
          order.status = 'cooking'; 
        });
      }

      const orderItemsCollection = db.get('order_items');
      for (const cartItem of cart) {
        await orderItemsCollection.create((oi: any) => {
          oi.tenantId = activeTenant;
          oi.order.set(activeOrderRecord);
          oi.item.set(cartItem.item);
          oi.quantity = cartItem.quantity;
          oi.price = cartItem.item.price;
        });
      }

      setCart([]);
      setSelectedTable(null);
      setActiveAppendOrder(null);
    });
  };

  const totalItems = cart.reduce((sum, cartItem) => sum + cartItem.quantity, 0);
  const totalPrice = cart.reduce((sum, cartItem) => sum + (cartItem.item.price * cartItem.quantity), 0);

  // Dynamic Menu view parsing (Table mapped)
  let viewBody;
  if (activeView === 'menu') {
    if (!selectedTable) {
      viewBody = (
        <EnhancedTableGrid 
          activeTenant={activeTenant} 
          maxTables={settings.tableCount}
          onSelectTable={(tableNum: string, order: any) => {
            setSelectedTable(tableNum);
            setActiveAppendOrder(order);
          }} 
        />
      );
    } else {
      viewBody = (
        <>
          <View style={{paddingHorizontal: 20, paddingTop: 15, paddingBottom: 5, flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity onPress={() => { setSelectedTable(null); setActiveAppendOrder(null); }} style={{marginRight: 10, paddingVertical: 4}}>
               <Text style={{color: colors.primary, fontWeight: '800'}}>← Back to Floor</Text>
            </TouchableOpacity>
            <Text style={{fontSize: 16, fontWeight: '800', color: colors.textHeader}}> | Table {selectedTable}</Text>
          </View>
          <View>
            <EnhancedCategorySelector 
              profileId={selectedProfileId} 
              activeTenant={activeTenant}
              selectedId={selectedCategoryId} 
              onSelect={setSelectedCategoryId} 
            />
          </View>
          <EnhancedItemGrid categoryId={selectedCategoryId} activeTenant={activeTenant} onItemPress={handleAddToCart} />
        </>
      );
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTopInfo}>
          <Text style={styles.headerTitle}>Tap2Chef POS</Text>
          <TouchableOpacity style={styles.seedButton} onPress={handleSeedData} activeOpacity={0.8}>
            <Text style={styles.seedButtonText}>+ Seed Test Data</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.toggleContainer}>
          <TouchableOpacity style={[styles.toggleBtn, activeView === 'menu' && styles.toggleBtnActive]} onPress={() => setActiveView('menu')} activeOpacity={0.8}>
            <Text style={[styles.toggleText, activeView === 'menu' && styles.toggleTextActive]}>{selectedTable ? 'POS' : 'Floor'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.toggleBtn, activeView === 'builder' && styles.toggleBtnActive]} onPress={() => setActiveView('builder')} activeOpacity={0.8}>
            <Text style={[styles.toggleText, activeView === 'builder' && styles.toggleTextActive]}>Builder</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.toggleBtn, activeView === 'queue' && styles.toggleBtnActive]} onPress={() => setActiveView('queue')} activeOpacity={0.8}>
            <Text style={[styles.toggleText, activeView === 'queue' && styles.toggleTextActive]}>Active</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.toggleBtn, activeView === 'billing' && styles.toggleBtnActive]} onPress={() => setActiveView('billing')} activeOpacity={0.8}>
            <Text style={[styles.toggleText, activeView === 'billing' && styles.toggleTextActive]}>Bills</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.toggleBtn, activeView === 'expenses' && styles.toggleBtnActive]} onPress={() => setActiveView('expenses')} activeOpacity={0.8}>
            <Text style={[styles.toggleText, activeView === 'expenses' && styles.toggleTextActive]}>Exp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.toggleBtn, activeView === 'dashboard' && styles.toggleBtnActive]} onPress={() => setActiveView('dashboard')} activeOpacity={0.8}>
            <Text style={[styles.toggleText, activeView === 'dashboard' && styles.toggleTextActive]}>Dash</Text>
          </TouchableOpacity>
        </View>

        {activeView === 'menu' && selectedTable && (
          <EnhancedProfileSelector 
            activeTenant={activeTenant}
            selectedId={selectedProfileId} 
            onSelect={(id: string) => {
              setSelectedProfileId(id);
              setSelectedCategoryId(null); 
            }} 
          />
        )}
      </View>

      {/* BODY */}
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {activeView === 'menu' ? (
          viewBody
        ) : activeView === 'builder' ? (
          <MenuBuilderView activeTenant={activeTenant} selectedProfileId={selectedProfileId} />
        ) : activeView === 'queue' ? (
          <EnhancedActiveOrders activeTenant={activeTenant} />
        ) : activeView === 'billing' ? (
          <EnhancedPendingBills activeTenant={activeTenant} />
        ) : activeView === 'expenses' ? (
          <ExpenseTracker activeTenant={activeTenant} />
        ) : (
          <EnhancedRevenueDashboard activeTenant={activeTenant} />
        )}
      </View>

      {/* BOTTOM ACTION BAR */}
      {activeView === 'menu' && selectedTable && (
        <View style={styles.bottomBar}>
          <Text style={styles.cartInfoText}>
            {activeAppendOrder ? 'Appending To Order' : 'New Order'} : {totalItems} Items | Cart Total: ${totalPrice.toFixed(2)}
          </Text>
          <TouchableOpacity style={styles.fireButton} activeOpacity={0.88} onPress={handleFireKOT}>
            <Text style={styles.fireButtonText}>FIRE KOT</Text>
          </TouchableOpacity>
        </View>
      )}
      
    </View>
  );
};


// --- AUTH GATEWAY ---
const AuthGateway = ({ setActiveTenant }: { setActiveTenant: (tenant: string) => void }) => {
  const [authStep, setAuthStep] = useState<'signin' | 'signup' | 'otp'>('signin');
  const [email, setEmail] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [otpCode, setOtpCode] = useState('');

  const handleRegister = () => {
    if (!email.trim() || !restaurantName.trim()) return;
    const mockTenantId = `tenant_${Date.now()}`;
    setActiveTenant(mockTenantId);
  };

  const handleSendOtp = () => {
    if (!email.trim()) return;
    setAuthStep('otp');
  };

  const handleVerifyOtp = () => {
    if (otpCode.length !== 4) return;
    const mockTenantId = `tenant_${Date.now()}`;
    setActiveTenant(mockTenantId);
  };

  return (
    <SafeAreaView style={styles.authContainer}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.authCard}>
        {authStep === 'signup' && (
          <>
            <Text style={styles.authTitle}>Register Restaurant</Text>
            <Text style={styles.authSubtitle}>Create your Tap2Chef workspace</Text>
            
            <View style={styles.inputStack}>
              <Text style={styles.inputLabel}>Restaurant Name</Text>
              <TextInput style={styles.textInputFull} value={restaurantName} onChangeText={setRestaurantName} placeholder="E.g. Spice Route" />
            </View>
            <View style={styles.inputStack}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput style={styles.textInputFull} value={email} onChangeText={setEmail} placeholder="admin@restaurant.com" keyboardType="email-address" autoCapitalize="none" />
            </View>

            <TouchableOpacity style={styles.primaryAuthBtn} onPress={handleRegister} activeOpacity={0.8}>
              <Text style={styles.primaryAuthBtnText}>Create Workspace</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.authFooterLink} onPress={() => setAuthStep('signin')}>
              <Text style={styles.authFooterText}>Already have an account? <Text style={{fontWeight: '800', color: colors.primary}}>Sign In</Text></Text>
            </TouchableOpacity>
          </>
        )}

        {authStep === 'signin' && (
          <>
            <Text style={styles.authTitle}>Welcome Back</Text>
            <Text style={styles.authSubtitle}>Access your Tap2Chef POS</Text>

            <View style={styles.inputStack}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput style={styles.textInputFull} value={email} onChangeText={setEmail} placeholder="admin@restaurant.com" keyboardType="email-address" autoCapitalize="none" />
            </View>

            <TouchableOpacity style={styles.primaryAuthBtn} onPress={handleSendOtp} activeOpacity={0.8}>
              <Text style={styles.primaryAuthBtnText}>Send OTP</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.authFooterLink} onPress={() => setAuthStep('signup')}>
              <Text style={styles.authFooterText}>New restaurant? <Text style={{fontWeight: '800', color: colors.primary}}>Register here</Text></Text>
            </TouchableOpacity>
          </>
        )}

        {authStep === 'otp' && (
          <>
            <Text style={styles.authTitle}>Enter Verification Code</Text>
            <Text style={styles.authSubtitle}>Sent to {email}</Text>

            <View style={styles.inputStack}>
              <Text style={styles.inputLabel}>4-Digit OTP</Text>
              <TextInput style={styles.textInputFull} value={otpCode} onChangeText={setOtpCode} placeholder="0000" keyboardType="numeric" maxLength={4} />
            </View>

            <TouchableOpacity style={styles.primaryAuthBtn} onPress={handleVerifyOtp} activeOpacity={0.8}>
              <Text style={styles.primaryAuthBtnText}>Verify & Login</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.authFooterLink} onPress={() => setAuthStep('signin')}>
              <Text style={styles.authFooterText}>Did not receive code? <Text style={{fontWeight: '800', color: colors.textSecondary}}>Back to Email</Text></Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

// --- SETUP WIZARD AND GATEWAY ---
const SetupWizardScreen = ({ activeTenant }: { activeTenant: string }) => {
  const db = useDatabase();
  const [menuName, setMenuName] = useState('');
  const [tableCount, setTableCount] = useState<number>(10);

  const handleCompleteSetup = async () => {
    if (!menuName.trim()) return;

    await db.write(async () => {
      await db.get('tenant_settings').create((setting: any) => {
        setting.tenantId = activeTenant;
        setting.tableCount = tableCount;
      });

      await db.get('menu_profiles').create((profile: any) => {
        profile.tenantId = activeTenant;
        profile.name = menuName.trim();
        profile.isActive = true;
      });
    });
  };

  return (
    <SafeAreaView style={styles.authContainer}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.authCard}>
        <Text style={styles.authTitle}>Welcome!</Text>
        <Text style={styles.authSubtitle}>Let's set up your restaurant.</Text>

        <View style={styles.inputStack}>
          <Text style={styles.inputLabel}>First Menu Name</Text>
          <TextInput 
            style={styles.textInputFull} 
            value={menuName} 
            onChangeText={setMenuName} 
            placeholder="E.g. Dine-In" 
          />
        </View>

        <View style={styles.inputStack}>
          <Text style={styles.inputLabel}>How many tables?</Text>
          <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' }}>
            {[10, 20, 30].map(num => (
              <TouchableOpacity 
                key={num}
                style={[
                  styles.toggleBtn, 
                  { borderWidth: 1, paddingVertical: 12 },
                  tableCount === num ? { backgroundColor: colors.primary, borderColor: colors.primary } : { backgroundColor: 'transparent', borderColor: colors.border }
                ]}
                onPress={() => setTableCount(num)}
              >
                <Text style={[styles.toggleText, tableCount === num ? { color: colors.surface, fontSize: 13 } : null]}>
                  1-{num}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.primaryAuthBtn} onPress={handleCompleteSetup} activeOpacity={0.8}>
          <Text style={styles.primaryAuthBtnText}>Complete Setup</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const TenantGatewayView = ({ settings, activeTenant }: any) => {
  if (!settings || settings.length === 0) {
    return <SetupWizardScreen activeTenant={activeTenant} />;
  }
  return <MainPosScreen activeTenant={activeTenant} settings={settings[0]} />;
};

const EnhancedTenantGateway = withObservables(['activeTenant'], ({ activeTenant }: any) => ({
  settings: database.get('tenant_settings').query(Q.where('tenant_id', activeTenant)).observe(),
}))(TenantGatewayView);

// --- APP WRAPPER ---
const App = () => {
  const [activeTenant, setActiveTenant] = useState<string | null>(null);

  if (!activeTenant) {
    return <AuthGateway setActiveTenant={setActiveTenant} />;
  }

  return (
    <DatabaseProvider database={database}>
      <EnhancedTenantGateway activeTenant={activeTenant} />
    </DatabaseProvider>
  );
};

export default App;
