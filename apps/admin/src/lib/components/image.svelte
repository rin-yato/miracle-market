<script lang="ts">
  type Props = {
    src: string;
    alt: string;
    className: string;
  };

  let className: Props['className'];
  let src: Props['src'];
  let alt: Props['alt'];

  export { className as class, src, alt };
</script>

<img {src} {alt} class={className} />
