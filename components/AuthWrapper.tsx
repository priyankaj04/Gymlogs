import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';

interface AuthWrapperProps {
    children: React.ReactNode;
}

type AuthScreen = 'login' | 'register' | '';

export default function AuthWrapper({ children }: AuthWrapperProps) {
    const { isAuthenticated, isLoading } = useAuth();
    const [currentScreen, setCurrentScreen] = useState<AuthScreen>('login');

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF6B35" />
            </View>
        );
    }

    if (!isAuthenticated) {
        if (currentScreen === 'login') {
            return (
                <LoginScreen
                    onNavigateToRegister={() => setCurrentScreen('register')}
                    onLoginSuccess={() => {
                        setCurrentScreen('');
                    }}
                />
            );
        } else {
            return (
                <RegisterScreen
                    onNavigateToLogin={() => setCurrentScreen('login')}
                    onRegisterSuccess={() => {
                        setCurrentScreen('');
                    }}
                />
            );
        }
    }

    return <>{children}</>;
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
});