import { ActionIcon, Menu, Text, Group } from '@mantine/core';
import { useRouter } from 'next/router';
import { IconLanguage } from '@tabler/icons-react';

export function LanguageSwitcher() {
  const router = useRouter();

  const handleLanguageChange = (value: string) => {
    router.push(router.pathname, router.asPath, { locale: value });
  };

  const languages = [
    { value: 'en', label: 'English', flag: '🇬🇧' },
    { value: 'es', label: 'Español', flag: '🇪🇸' },
  ];

  const currentLang = languages.find((l) => l.value === router.locale) || languages[0];

  return (
    <Menu shadow="md" width={150} position="bottom-end" transition="pop-top-right">
      <Menu.Target>
        <ActionIcon
          variant="light"
          size="lg"
          aria-label="Switch Language"
          sx={(theme) => ({
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: theme.white,
            borderRadius: theme.radius.md,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            },
          })}
        >
          <Group spacing={4} px={4}>
            <IconLanguage size={18} strokeWidth={1.5} />
            <Text size="xs" weight={700} sx={{ textTransform: 'uppercase' }}>
              {router.locale}
            </Text>
          </Group>
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Select Language</Menu.Label>
        {languages.map((lang) => (
          <Menu.Item
            key={lang.value}
            icon={<span>{lang.flag}</span>}
            onClick={() => handleLanguageChange(lang.value)}
            sx={(theme) => ({
              backgroundColor: router.locale === lang.value ? theme.colors.indigo[0] : 'transparent',
              fontWeight: router.locale === lang.value ? 600 : 400,
            })}
          >
            {lang.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
