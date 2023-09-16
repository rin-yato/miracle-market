<script lang="ts">
  import type { HTMLDivAttributes } from 'bits-ui/dist/internal';

  type $$Props = HTMLDivAttributes & {
    text: string | number;
  };

  export let text: $$Props['text'];
</script>

<div {...$$restProps}>
  {text}
</div>
