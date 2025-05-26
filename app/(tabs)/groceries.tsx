// groceries.tsx
// Connects the Groceries tab to the GroceryScreen component.
// Sets 'groceries' as the initial route and hides the header for a cleaner UI.

import GroceryScreen from '../screens/GroceryScreen';

export default function GroceriesTab() {
  return <GroceryScreen />;
}

export const unstable_settings = {
  initialRouteName: 'groceries',
};

GroceriesTab.options = {
  headerShown: false,
};
