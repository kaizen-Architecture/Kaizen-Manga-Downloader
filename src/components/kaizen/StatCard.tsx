import { Paper, Group, ThemeIcon, Stack, Text, Title } from '@mantine/core';

export function StatCard({
  label,
  value,
  icon: Icon,
  color,
  onClick,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  onClick?: () => void;
}) {
  return (
    <Paper
      withBorder
      p="lg"
      radius="md"
      onClick={onClick}
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows.md,
        },
      })}
    >
      <Group>
        <ThemeIcon size={48} radius="md" color={color} variant="light">
          <Icon size={24} />
        </ThemeIcon>
        <Stack spacing={2}>
          <Text size="xs" color="dimmed" weight={500} transform="uppercase">
            {label}
          </Text>
          <Title order={2}>{value}</Title>
        </Stack>
      </Group>
    </Paper>
  );
}

StatCard.defaultProps = {
  onClick: undefined,
};
