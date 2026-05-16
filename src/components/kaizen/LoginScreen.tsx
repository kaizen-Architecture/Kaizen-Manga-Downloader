import { Button, Container, Paper, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core';
import { setCookie } from 'cookies-next';
import { motion } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';
import { trpc } from '../../utils/trpc';

export function LoginScreen({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const { t } = useTranslation('settings');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      setErrorMsg('');
      setCookie('kaizen-session', JSON.stringify(data.user), { maxAge: 60 * 60 * 24 * 30 });
      onLoginSuccess();
    },
    onError: (err) => {
      setErrorMsg(err.message || 'Credenciales inválidas');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    loginMutation.mutate({ username, password });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
      }}
    >
      <Container size="xs" style={{ width: '100%', maxWidth: 420 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Paper
            radius="md"
            p="xl"
            withBorder
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              borderColor: 'rgba(255, 255, 255, 0.08)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            }}
          >
            <Stack spacing="md">
              <div style={{ textAlign: 'center' }}>
                <Title order={2} style={{ color: '#fff', fontWeight: 800 }}>
                  Kaizen
                </Title>
                <Text size="xs" color="dimmed" mt={4}>
                  {t('auth.subtitle', 'Acceso Seguro Restringido')}
                </Text>
              </div>

              <form onSubmit={handleSubmit}>
                <Stack spacing="sm">
                  <TextInput
                    label={t('auth.usernameLabel', 'Usuario')}
                    placeholder="admin"
                    value={username}
                    onChange={(e) => setUsername(e.currentTarget.value)}
                    required
                    styles={{
                      label: { color: '#e2e8f0' },
                      input: {
                        background: 'rgba(0, 0, 0, 0.2)',
                        color: '#fff',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  />

                  <PasswordInput
                    label={t('auth.passwordLabel', 'Contraseña')}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.currentTarget.value)}
                    required
                    styles={{
                      label: { color: '#e2e8f0' },
                      input: {
                        background: 'rgba(0, 0, 0, 0.2)',
                        color: '#fff',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                      },
                      innerInput: { color: '#fff' },
                    }}
                  />

                  {errorMsg && (
                    <Text size="xs" color="red" align="center" weight={500}>
                      {errorMsg}
                    </Text>
                  )}

                  <Button
                    type="submit"
                    fullWidth
                    mt="md"
                    color="indigo"
                    loading={loginMutation.isLoading}
                    style={{ backgroundImage: 'linear-gradient(45deg, #4f46e5 0%, #6366f1 100%)' }}
                  >
                    {t('auth.loginBtn', 'Iniciar Sesión')}
                  </Button>
                </Stack>
              </form>
            </Stack>
          </Paper>
        </motion.div>
      </Container>
    </div>
  );
}
