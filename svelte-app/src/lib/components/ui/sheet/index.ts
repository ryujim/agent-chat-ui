import { Sheet as SheetPrimitive } from "bits-ui";
import Root from "./sheet.svelte";
import Content from "./sheet-content.svelte";
import Header from "./sheet-header.svelte";
import Title from "./sheet-title.svelte";
import Description from "./sheet-description.svelte";
import Footer from "./sheet-footer.svelte";
import Close from "./sheet-close.svelte";

const Trigger = SheetPrimitive.Trigger;

export {
  Root,
  Content,
  Header,
  Title,
  Description,
  Footer,
  Close,
  Trigger,
  //
  Root as Sheet,
  Content as SheetContent,
  Header as SheetHeader,
  Title as SheetTitle,
  Description as SheetDescription,
  Footer as SheetFooter,
  Close as SheetClose,
  Trigger as SheetTrigger,
};
