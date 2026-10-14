/**
 * Public API of the shared components: import from `@/components`, never from a file inside it.
 * Files inside `src/components` import each other directly (not from here) to avoid cycles.
 */

/* ---------- UI ---------- */
export { Button } from '@/components/ui/Button';
export { buttonVariants, type ButtonVariantProps } from '@/components/ui/button-variants';
export {
  Carousel,
  CarouselAnnouncer,
  CarouselControls,
  CarouselSlide,
  CarouselTabs,
  CarouselViewport,
} from '@/components/ui/Carousel';
export { type IGoToOptions } from '@/components/ui/carousel-context';
export { Chip } from '@/components/ui/Chip';
export { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/Dialog';
export { SearchField } from '@/components/ui/SearchField';
export { Select, type ISelectOption } from '@/components/ui/Select';
export { Skeleton } from '@/components/ui/Skeleton';
export { Spinner } from '@/components/ui/Spinner';

/* ---------- Layout ---------- */
export { MainLayout } from '@/components/layout/MainLayout';
export { PageHeader } from '@/components/layout/PageHeader';
export { renderRouterHomeLink } from '@/components/layout/router-home-link';
export { SiteHeader, type IHomeLinkRenderProps } from '@/components/layout/SiteHeader';
export { SkipLink } from '@/components/layout/SkipLink';
export { ThemeToggle } from '@/components/layout/ThemeToggle';

/* ---------- Feedback ---------- */
export { ErrorScreen } from '@/components/feedback/ErrorScreen';
export { StateMessage } from '@/components/feedback/StateMessage';
