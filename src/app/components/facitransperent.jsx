"use client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

const Facilities = ({ hspcategory, doctorcategory, diagnosticCategory }) => {
  const router = useRouter()
  const pathname = usePathname()

  const handleClick = (e, link) => {
    e.preventDefault()
    router.push(link)
  }

  const navlinks = [
    {
      title: "Expert Doctors",
      link: "/mobilenav/0",
      submenu:
        doctorcategory && Array.isArray(doctorcategory)
          ? doctorcategory.map((category) => ({
              title: category.title,
              link: `/doctor/${category.id}`,
            }))
          : [],
    },
    {
      title: "Hospitals",
      link: "/mobilenav/1",
      submenu:
        hspcategory && Array.isArray(hspcategory)
          ? hspcategory.map((category) => ({
              title: category.title,
              link: `/hospital/${category.id}`,
            }))
          : [],
    },
    {
      title: "Diagnostic Center",
      link: "/mobilenav/2",
      submenu:
        diagnosticCategory && Array.isArray(diagnosticCategory)
          ? diagnosticCategory.map((category) => ({
              title: category.title,
              link: `/diagnosticcenter/${category.id}`,
            }))
          : [],
    },
    {
      title: "Surgery Packages",
      link: "/mobilenav/3",
      submenu: [
        { title: "Surgery Packages", link: "/surgerypackages" },
        { title: "Treatment Packages", link: "/surgerypackages" },
      ],
    },
    {
      title: "Home Healthcare",
      link: "/mobilenav/4",
      submenu: [
        { title: "ICU at Home", link: "/home-healthcare/ICU%20at%20Home" },
        { title: "General Nursing", link: "/home-healthcare/General%20Nursing" },
       { 
  title: "Neurological Care & Rehabilitation", 
  link: "/home-healthcare/Neurological%20Care%20%26%20Rehabilitation" 
},
        { title: "Cancer Care on Bed", link: "/home-healthcare/Cancer%20Care%20on%20Bed" },
        { title: "Transplant & Post-Op Care", link: "/home-healthcare/Transplant%20%26%20Post-Op%20Care" },
        { title: "Pregnancy Care", link: "/home-healthcare/Pregnancy%20Care" },
        { title: "Mother & Child Care", link: "/home-healthcare/Mother%20%26%20Child%20Care" },
        { title: "Palliative Care", link: "/home-healthcare/Palliative%20Care" },
        { title: "Orthopaedic Care", link: "/home-healthcare/Orthopaedic%20Care" },
        { title: "Stroke Care", link: "/home-healthcare/Stroke%20Care" },
        { title: "Cardiac Care", link: "/home-healthcare/Cardiac%20Care" },
        { title: "Dialysis Care", link: "/home-healthcare/Dialysis%20Care" },
        { title: "Old Age Health Care", link: "/home-healthcare/Old%20Age%20Health%20Care" },
        { title: "COPD Care", link: "/home-healthcare/COPD%20Care" },
        { title: "Bed Sores Care", link: "/home-healthcare/Bed%20Sores%20Care" },
      ],
    },
    {
      title: "Pathology",
      link: "/mobilenav/5",
      submenu: [
        { title: "Lab Tests", link: "/pathology/category?letter=A" },
        { title: "Wellness Packages", link: "/pathology/wellness-packages" },
        { title: "NABL Accredited Lab", link: "/pathology/bloodbanks" },
        { title: "Blood Bank", link: "/pathology/bloodbanks" },
      ],
    },
    {
      title: "Health Insurance",
      link: "/health-insurance",
     submenu: [
      { title: "Government Health Insurance", link: "/health-insurance/category?name=government" },
      { title: "Private Health Insurance", link: "/health-insurance/category?name=private" },
      { title: "TPA Health Insurance", link: "/health-insurance/category?name=tpa" },
      { title: "TPA Administration Services", link: "/health-insurance/category?name=tpa_admin" },
    ],

    },
    {
      title: "Corporate Health",
      link: "/mobilenav/7",
      submenu: [
        { title: "Medical Personnel Manning", link: "#" },
        { title: "Companies Insurance", link: "#" },
        { title: "CSR Services", link: "#" },
        { title: "Health Talks & Seminars", link: "#" },
        { title: "Occupation Health Center", link: "#" },
        { title: "Corporate Health Check-ups", link: "#" },
        { title: "24/7 Ambulance Services", link: "#" },
        { title: "Equipped Mobile Medical Unit", link: "#" },
      ],
    },
    {
      title: "Pharmacy",
      link: "/mobilenav/8",
      submenu: [
        { title: "TATA 1mg", link: "#" },
        { title: "Apollo 24/7", link: "#" },
        { title: "Pharm Easy", link: "#" },
        { title: "Netmeds", link: "#" }, { title: "Flipkart Health", link: "#" }, { title: "Indian Chemist", link: "#" }, { title: "HEALTH KART", link: "#" }, { title: "MeD LIFe", link: "#" }, { title: "India pharm", link: "#" }, { title: "MedPlus Mart", link: "#" },
      ],
    },
  ]

  return (
    <div className="container mx-auto px-4 min-[1000px]:px-[14px] min-[1100px]:px-[8px] xl:px-[2px] my-2">
      <div className="flex justify-center lg:justify-between  min-[1000px]:gap-x-[1px] xl:gap-x-[2px]  w-full">
        {navlinks.map((nav) => {
          const totalItems = nav.submenu.length
          let columns = 1
          if (totalItems > 10 && totalItems <= 20) {
            columns = 2
          } else if (totalItems > 20 && totalItems <= 30) {
            columns = 3
          } else if (totalItems > 30) {
            columns = 4
          }
          columns = Math.max(1, columns)
          const itemsPerColumn = Math.ceil(totalItems / columns)
          const columnsArray = Array.from({ length: columns }, (_, colIndex) => {
            return nav.submenu.slice(colIndex * itemsPerColumn, (colIndex + 1) * itemsPerColumn)
          })

          const isActive = pathname === nav.link ||nav.submenu.some((item) => pathname.startsWith(item.link))

          return (
            <DropdownMenu key={nav.title}>
              <DropdownMenuTrigger asChild>
                <Button
                  className={cn(
                    "flex items-center gap-1 min-[1000px]:px-[2px] min-[1100px]:px-[6px] min-[1200px]:px-[6px] xl:px-1 xlg:px-3.5 py-2 rounded-xl min-[1000px]:text-[10px] min-[1100px]:text-xs font-semibold transition-colors ",
                    isActive ? "bg-[#FF5E00] text-white hover:bg-gray-100 hover:text-[#453565]" : "bg-gray-100  text-[#453565] hover:bg-gray-100 hover:text-[#453565]",
                  )}
                  size="sm"
                  onClick={(e) => handleClick(e, nav.link)}
                >
                  <span className="select-none">{nav.title}</span>
                  <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="text-xs min-w-[100px] max-w-[90vw] md:max-w-[800px] bg-white p-4 shadow-lg rounded-xl"
                align="start"
              >
                <DropdownMenuItem className="p-0">
                  <Button
                    size="sm"
                    onClick={(e) => handleClick(e, nav.link)}
                    className="w-full justify-center rounded-xl font-bold px-3 py-1 text-xs bg-[#5271FF] hover:bg-[#5271FF]/90 text-white"
                  >
                    View More {nav.title}
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-2" />

                <div className="text-sm bg-white grid grid-flow-col auto-cols-max  gap-y-1">
                  {columnsArray.map((columnItems, colIndex) => (
                    <div key={colIndex} className="flex">
                      <div className="min-w-[120px] max-w-[180px]">
                        {columnItems.map((item) => (
                          <DropdownMenuItem key={item.link} className="p-0 !text-[10px]">
                            <Link href={item.link} className="block w-full py-0 px-2">
                              <span className="text-[#453565] font-medium hover:underline">{item.title}</span>
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </div>
                      {colIndex < columnsArray.length - 1 && <div className="border-l border-gray-200 mx-4"></div>}
                    </div>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        })}
      </div>
    </div>
  )
}

export default Facilities