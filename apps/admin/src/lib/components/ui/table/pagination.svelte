<script lang="ts">
  import { IconChevronLeft, IconChevronRight } from '@tabler/icons-svelte';
  import { Button } from '../button';
  import { cn } from '$lib/utils';
  import { page } from '$app/stores';

  export let totalItems: number;
  export let perPage: number;

  let className: string = '';

  export { className as class };

  const totalPage = Math.ceil(totalItems / perPage);

  $: currentPage = parseInt($page.url.searchParams.get('page') ?? '1');

  const getLinks = (url: URL) => {
    const prevUrl = new URL(url);
    const nextUrl = new URL(url);

    const noPrev = currentPage === 1;
    const noNext = currentPage === totalPage;

    const prevPage = noPrev ? 1 : currentPage - 1;
    const nextPage = noNext ? currentPage : currentPage + 1;

    prevUrl.searchParams.set('page', prevPage.toString());
    nextUrl.searchParams.set('page', nextPage.toString());

    const prev = noPrev ? null : prevUrl.pathname + prevUrl.search;
    const next = noNext ? null : nextUrl.pathname + nextUrl.search;

    return { prev, next };
  };

  $: links = getLinks($page.url);
</script>

<nav class={cn('flex items-center gap-10', className)}>
  <p>Page {currentPage} of {totalPage}</p>
  <div class="flex gap-2">
    <Button
      size="icon"
      variant="outline"
      href={links.prev}
      
      disabled={links.prev === null}
    >
      <IconChevronLeft size={18} class="text-muted-foreground" />
    </Button>
    <Button
      size="icon"
      variant="outline"
      href={links.next}
      disabled={links.next === null}
    >
      <IconChevronRight size={18} class="text-muted-foreground" />
    </Button>
  </div>
</nav>
