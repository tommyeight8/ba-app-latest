// "use client";

// import { IconHome2, IconClipboardList, IconUsers } from "@tabler/icons-react";

// const iconMap = {
//   home: IconHome2,
//   clipboard: IconClipboardList,
//   users: IconUsers,
// };

// type NavItem = {
//   title: string;
//   url: string;
//   icon: keyof typeof iconMap; // icon is a string key
// };

// type NavMainProps = {
//   items: NavItem[];
// };

// export function NavMain({ items }: NavMainProps) {
//   return (
//     <nav className="flex flex-col gap-2 p-4">
//       {items.map((item) => {
//         const Icon = iconMap[item.icon];
//         return (
//           <a
//             key={item.url}
//             href={item.url}
//             className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition"
//           >
//             {Icon && <Icon size={20} />}
//             <span>{item.title}</span>
//           </a>
//         );
//       })}
//     </nav>
//   );
// }
