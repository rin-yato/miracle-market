<script>
  import { IconBell, IconHelp } from '@tabler/icons-svelte';
  import { Button } from './ui/button';
  import Badge from './ui/badge/badge.svelte';
</script>

<header class="flex items-center justify-between bg-white px-5 py-3">
  <Button variant="ghost" class="group text-muted-foreground">
    <Badge variant="outline" class="px-1">
      <span class="text-xs duration-200 group-hover:text-foreground">
        ⌘K
      </span>
    </Badge>
    <span class="mx-1.5">Open Command</span>
  </Button>
  <nav>
    <Button variant="ghost" size="icon">
      <IconHelp size={20} />
    </Button>
    <Button variant="ghost" size="icon">
      <IconBell size={20} />
    </Button>
  </nav>
</header>
