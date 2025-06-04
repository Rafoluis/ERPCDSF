import { CalendarClock, ChevronRight, ClipboardPlus, ContactRound, FileUser, Hospital, Stethoscope, UserPen, WalletCards,  } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useUser from "@/hooks/useUser";

const menuItems = [
    {
        title: 'MENU', 
        items: [
            //{ label: 'Inicio', href: '/', visible: ['admin', 'recepcionista', 'odontologo'] },
            { icon:  <CalendarClock size={20} />, label: 'Agenda de citas', href: '/list/appointmentBooks', visible: ['odontologo'] },
            { icon:  <CalendarClock size={20} />, label: 'Gestión de citas', href: '/list/appointments', visible: ['admin', 'recepcionista'] },
            { icon:  <ContactRound size={20} />, label: 'Pacientes', href: '/list/patients', visible: ['admin', 'recepcionista'] },
            { icon:  <ClipboardPlus size={20} />,label: 'Servicios', href: '/list/service', visible: ['admin'] },
            { icon:  <FileUser size={20} />, label: 'Historias Clínicas', href: '/list/dentalHistory', visible: ['admin', 'recepcionista', 'odontologo'] },
            { icon:  <WalletCards size={20} />, label: 'Boletería', href: '/list/ticket', visible: ['admin', 'recepcionista'] },
            { icon:  <Stethoscope size={20} />, label: 'Médicos', href: '/list/doctors', visible: ['admin', 'recepcionista'] },
        ],
        visible: ['admin', 'recepcionista', 'odontologo']
    },
    {
        title: "OTROS",
        items: [
            { icon:  <UserPen size={20} />, label: 'Empleados', href: '/admin', visible: ['admin'] },
            { icon:  <Hospital size={20} />, label: 'Empresa', href: '/company', visible: ['admin'] }
        ],
        visible: ['admin']
    }
];

const Menu = () => {
    const { role } = useUser();
    const pathname = usePathname();

    return (
    <div className="mt-4 text-md">
      {menuItems.map((section, index) =>
        section.visible.includes(role as string) && (
          <div
            className={`flex flex-col gap-2 ${index === 0 ? 'mb-6' : ''}`}
            key={section.title}
          >
            <span className="hidden lg:block text-textdefault font-semibold my-2">
              {section.title}
            </span>
            {section.items.map((item) => {
              if (!item.visible.includes(role as string)) return null;
              const isActive = pathname === item.href;

              return (
                <Link
                  href={item.href}
                  key={item.label}
                  className={`flex items-center justify-between py-2 px-4 rounded-md ${
                    isActive
                      ? 'bg-backselectbutton text-textdefault font-semibold'
                      : 'text-textdefault hover:bg-backhoverbutton hover:text-textdark'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex-shrink-0">{item.icon}</div>
                    <span className="hidden md:inline">{item.label}</span>
                  </div>
                  {isActive && (
                    <ChevronRight size={14} className="text-textdark" />
                  )}
                </Link>
              );
            })}
          </div>
        )
      )}
    </div>
  );
};

export default Menu;