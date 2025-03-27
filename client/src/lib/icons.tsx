import { LucideProps } from "lucide-react";

// Import all icons from lucide-react that we need
import {
  Leaf,
  Truck,
  Recycle,
  MapPin,
  Mail,
  Phone,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Star,
  ShoppingCart,
  X,
  Plus,
  Minus,
  Search,
  Menu,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Heart,
  Sprout,
  ShieldCheck,
  StarHalf,
  Image,
} from "lucide-react";

// Export all icons with consistent naming convention
export const LeafIcon = (props: LucideProps) => <Leaf {...props} />;
export const TruckIcon = (props: LucideProps) => <Truck {...props} />;
export const RecycleIcon = (props: LucideProps) => <Recycle {...props} />;
export const MapPinIcon = (props: LucideProps) => <MapPin {...props} />;
export const MailIcon = (props: LucideProps) => <Mail {...props} />;
export const PhoneIcon = (props: LucideProps) => <Phone {...props} />;
export const ClockIcon = (props: LucideProps) => <Clock {...props} />;
export const FacebookIcon = (props: LucideProps) => <Facebook {...props} />;
export const TwitterIcon = (props: LucideProps) => <Twitter {...props} />;
export const InstagramIcon = (props: LucideProps) => <Instagram {...props} />;
export const PinterestIcon = (props: LucideProps) => <Image {...props} />;
export const StarFilledIcon = (props: LucideProps) => <Star fill="currentColor" {...props} />;
export const StarHalfFilledIcon = (props: LucideProps) => <StarHalf fill="currentColor" {...props} />;
export const ShoppingCartIcon = (props: LucideProps) => <ShoppingCart {...props} />;
export const SearchIcon = (props: LucideProps) => <Search {...props} />;
export const MenuIcon = (props: LucideProps) => <Menu {...props} />;
export const ChevronDownIcon = (props: LucideProps) => <ChevronDown {...props} />;
export const PlusIcon = (props: LucideProps) => <Plus {...props} />;
export const MinusIcon = (props: LucideProps) => <Minus {...props} />;
export const CloseIcon = (props: LucideProps) => <X {...props} />;
export const ArrowRightIcon = (props: LucideProps) => <ArrowRight {...props} />;
export const ArrowLeftIcon = (props: LucideProps) => <ArrowLeft {...props} />;
export const CalendarIcon = (props: LucideProps) => <Calendar {...props} />;
export const HeartIcon = (props: LucideProps) => <Heart {...props} />;
export const SproutIcon = (props: LucideProps) => <Sprout {...props} />;
export const ShieldCheckIcon = (props: LucideProps) => <ShieldCheck {...props} />;

// Re-export with additional names for backward compatibility
export { X } from "lucide-react";
export { Search } from "lucide-react";
export { ShoppingCart } from "lucide-react";
export { Menu } from "lucide-react";
export { ChevronDown } from "lucide-react";
export { Plus } from "lucide-react";
export { Minus } from "lucide-react";
