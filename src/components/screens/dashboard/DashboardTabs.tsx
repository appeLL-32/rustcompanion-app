import {
  CalendarDaysIcon,
  LinkIcon,
  MapIcon,
} from "@heroicons/react/24/outline";
import classNames from "classnames";
import { atom, useAtom } from "jotai";
import { useSession } from "next-auth/react";

export enum TabName {
  Connect,
  Events,
  Map,
}

export const tabAtom = atom<TabName>(TabName.Connect);

const Links = [
  {
    name: "Connect",
    tab: TabName.Connect,
    icon: <LinkIcon className="mb-1 h-8" />,
  },
  {
    name: "Events",
    tab: TabName.Events,
    icon: <CalendarDaysIcon className="mb-1 h-8" />,
  },
  {
    name: "Interactive Map",
    tab: TabName.Map,
    icon: <MapIcon className="mb-1 h-8" />,
  },
];
export const TopNavigation = () => {
  const [selectedTab, setSelectedTab] = useAtom(tabAtom);
  const session = useSession();

  if (!session.data) return null;

  return (
    <div className="container mx-auto mt-6 flex flex-col items-center justify-center gap-6 p-4">
      <div className="overflow-y-auto py-4">
        <ul className="grid grid-cols-3 gap-1 sm:gap-4">
          {Links.map((link) => (
            <li key={link.name} onClick={() => setSelectedTab(link.tab)}>
              <a
                href="#"
                className={classNames(
                  "flex items-center rounded-md bg-gray-800 p-2 px-3 py-2 text-sm font-medium text-black  sm:text-base",
                  link.tab === selectedTab
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                )}
              >
                {link.icon}
                <span className="ml-1 sm:ml-3">{link.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
