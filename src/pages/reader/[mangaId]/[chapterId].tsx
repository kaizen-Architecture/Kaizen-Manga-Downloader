import { useRouter } from 'next/router';
import { Box, Group, ActionIcon, Text, AppShell, Header, useMantineTheme, Center, Loader, Select } from '@mantine/core';
import { IconArrowLeft, IconStar } from '@tabler/icons-react';
import { useEffect, useState, useRef } from 'react';
import { useMediaQuery, useHotkeys } from '@mantine/hooks';
import Head from 'next/head';
import { trpc } from '../../../utils/trpc';

export default function ReaderPage() {
  const router = useRouter();
  const { mangaId, chapterId } = router.query;
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);

  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [readingDirection, setReadingDirection] = useState<'ltr' | 'rtl' | 'vertical'>('ltr');

  const containerRef = useRef<HTMLDivElement>(null);

  const mangaQuery = trpc.manga.get.useQuery(
    { id: parseInt(mangaId as string, 10) },
    { enabled: !!mangaId, refetchOnWindowFocus: false },
  );

  useEffect(() => {
    if (!mangaId || !chapterId) return;

    setLoading(true);
    fetch(`/api/reader/pages?id=${mangaId}&chapterId=${chapterId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load pages');
        return res.json();
      })
      .then((data) => {
        setPages(data.pages);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [mangaId, chapterId]);

  const goToNextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage((p) => p + 1);
    } else {
      // Potentially go to next chapter
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((p) => p - 1);
    }
  };

  const handleNextAction = readingDirection === 'ltr' ? goToNextPage : goToPrevPage;
  const handlePrevAction = readingDirection === 'ltr' ? goToPrevPage : goToNextPage;

  useHotkeys([
    ['ArrowRight', handleNextAction],
    ['ArrowLeft', handlePrevAction],
  ]);

  if (loading) {
    return (
      <Center style={{ height: '100vh' }}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center style={{ height: '100vh' }}>
        <Text color="red">{error}</Text>
      </Center>
    );
  }

  return (
    <>
      <Head>
        <title>Reader - {mangaQuery.data?.title || 'Loading...'}</title>
      </Head>
      <AppShell
        padding={0}
        header={
          <Header height={60} p="md" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Group>
              <ActionIcon onClick={() => router.push(`/manga/${mangaId}`)}>
                <IconArrowLeft />
              </ActionIcon>
              <Text weight={600} size="lg" sx={{ display: isMobile ? 'none' : 'block' }}>
                {mangaQuery.data?.title}
              </Text>
            </Group>
            <Group>
              <ActionIcon
                color="yellow"
                variant="light"
                onClick={async () => {
                  if (!mangaQuery.data) return;
                  const ch = mangaQuery.data.chapters.find((c: any) => c.id === parseInt(chapterId as string, 10));
                  if (!ch) return;
                  const isFav = ch.favoritePages.includes(currentPage);
                  const newPages = isFav
                    ? ch.favoritePages.filter((p: number) => p !== currentPage)
                    : [...ch.favoritePages, currentPage];
                  await fetch(`/api/reader/pages?id=${mangaId}&chapterId=${chapterId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ favoritePages: newPages }),
                  });
                  mangaQuery.refetch();
                }}
              >
                {mangaQuery.data?.chapters
                  .find((c: any) => c.id === parseInt(chapterId as string, 10))
                  ?.favoritePages.includes(currentPage) ? (
                  <IconStar fill="gold" size={20} />
                ) : (
                  <IconStar size={20} />
                )}
              </ActionIcon>
              <Text size="sm">
                Page {currentPage + 1} / {pages.length}
              </Text>
              <Select
                size="sm"
                data={[
                  { value: 'ltr', label: 'Left to Right' },
                  { value: 'rtl', label: 'Right to Left' },
                  { value: 'vertical', label: 'Vertical' },
                ]}
                value={readingDirection}
                onChange={(val) => setReadingDirection(val as 'ltr' | 'rtl' | 'vertical')}
                sx={{ width: 130 }}
              />
            </Group>
          </Header>
        }
      >
        <Box
          ref={containerRef}
          onClick={(e) => {
            if (readingDirection === 'vertical') return;
            const rect = containerRef.current?.getBoundingClientRect();
            if (!rect) return;
            const x = e.clientX - rect.left;
            if (x < rect.width / 3) {
              handlePrevAction();
            } else if (x > (rect.width * 2) / 3) {
              handleNextAction();
            }
          }}
          sx={{
            height: 'calc(100vh - 60px)',
            display: readingDirection === 'vertical' ? 'block' : 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[1],
            overflow: readingDirection === 'vertical' ? 'auto' : 'hidden',
            position: 'relative',
            cursor: readingDirection === 'vertical' ? 'default' : 'pointer',
          }}
        >
          {pages.length > 0 && readingDirection !== 'vertical' && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={pages[currentPage].url}
              alt={`Page ${currentPage + 1}`}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
            />
          )}
          {pages.length > 0 &&
            readingDirection === 'vertical' &&
            pages.map((page, index) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={page.name}
                src={page.url}
                alt={`Page ${index + 1}`}
                style={{
                  maxWidth: '100%',
                  display: 'block',
                  margin: '0 auto',
                }}
              />
            ))}
        </Box>
      </AppShell>
    </>
  );
}
