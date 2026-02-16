import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { SiteLayout } from './components/SiteLayout';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { StoryPage } from './pages/StoryPage';
import { SearchPage } from './pages/SearchPage';
import { AdminLogoPage } from './pages/AdminLogoPage';
import { AdminStoryNewPage } from './pages/AdminStoryNewPage';

const rootRoute = createRootRoute({
  component: SiteLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const categoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/category/$categoryId',
  component: CategoryPage,
});

const storyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/story/$storyId',
  component: StoryPage,
});

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/search',
  component: SearchPage,
});

const adminLogoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/logo',
  component: AdminLogoPage,
});

const adminStoryNewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/story/new',
  component: AdminStoryNewPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  categoryRoute,
  storyRoute,
  searchRoute,
  adminLogoRoute,
  adminStoryNewRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
