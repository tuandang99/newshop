import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { CartProvider } from "@/context/CartContext";
import MainLayout from "@/components/layouts/MainLayout";
import { lazy, Suspense } from 'react';
import { Skeleton } from './components/ui/skeleton';
import { ZaloButton } from '@/components/ui/zalo-button';

const About = lazy(() => import(/* webpackPrefetch: true */ './pages/About'));
const Admin = lazy(() => import(/* webpackPrefetch: true */ './pages/Admin')); 
const Blog = lazy(() => import(/* webpackPrefetch: true */ './pages/Blog'));
const BlogPost = lazy(() => import(/* webpackPrefetch: true */ './pages/BlogPost'));
const Contact = lazy(() => import(/* webpackPrefetch: true */ './pages/Contact'));
const Home = lazy(() => import(/* webpackPrefetch: true */ './pages/Home'));
const ProductDetail = lazy(() => import(/* webpackPrefetch: true */ './pages/ProductDetail'));
const Products = lazy(() => import(/* webpackPrefetch: true */ './pages/Products'));

function Router() {
  return (
    <MainLayout>
      <Suspense fallback={<Skeleton />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/products" component={Products} />
          <Route path="/products/:slug" component={ProductDetail} />
          <Route path="/about" component={About} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:slug" component={BlogPost} />
          <Route path="/contact" component={Contact} />
          <Route path="/admin" component={Admin} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </MainLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Router />
        <Toaster />
        <ZaloButton />
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;