import React from 'react';
import AppNavigation from "./src/navigation";
import { SavedRecipesProvider } from './src/context/SavedRecipesContext';

export default function App() {
    return (
        <SavedRecipesProvider>
            <AppNavigation />
        </SavedRecipesProvider>
    );
}