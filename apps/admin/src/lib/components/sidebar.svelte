<script lang="ts">
  import { cn } from '$lib/utils';
  import { Button } from '$lib/components/ui/button';
  import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar/';
  import {
    IconCurrencyDollar,
    IconDiscount2,
    IconSettings,
    IconShoppingBag,
    IconCategory
  } from '@tabler/icons-svelte';
  import { page } from '$app/stores';

  let className: string | null | undefined = undefined;

  export { className as class };

  $: isActive = (path: string) => $page.url.pathname.startsWith(path);

  $: getButtonVariant = (path: string) =>
    isActive(path) ? 'secondary' : 'link';

  const modules = [
    {
      name: 'Products',
      icon: IconShoppingBag,
      href: '/products'
    },
    {
      name: 'Categories',
      icon: IconCategory,
      href: '/categories'
    },
    {
      name: 'Discounts',
      icon: IconDiscount2,
      href: '/discounts'
    },
    {
      name: 'Settings',
      icon: IconSettings,
      href: '/settings'
    }
  ];
</script>

<aside class={cn('py-5 px-5 min-w-[250px] border-r  bg-white', className)}>
  <header class="space-y-4 px-2.5">
    <Avatar class="ring-1 ring-primary ring-offset-2">
      <AvatarImage
        src="https://source.boringavatars.com/beam/60/dailykicks"
      />
      <AvatarFallback>DK</AvatarFallback>
    </Avatar>

    <div>
      <p class="text-muted-foreground">Shop</p>
      <h1 class="font-semibold">Daily Kicks</h1>
    </div>
  </header>
  <div class="flex flex-col gap-1.5 mt-10">
    {#each modules as module}
      <Button
        href={module.href}
        variant={getButtonVariant(module.href)}
        class={cn(
          'justify-start items-center px-2.5 !no-underline hover:text-foreground text-muted-foreground font-normal',
          isActive(module.href) && 'text-foreground'
        )}
      >
        <svelte:component
          this={module.icon}
          class="mr-2 mb-px"
          size={18}
        />
        {module.name}
      </Button>
    {/each}
  </div>
</aside>
