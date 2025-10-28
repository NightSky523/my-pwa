import { Home, Search, Heart, User } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

const navigationItems = [
  {
    id: 'home',
    icon: Home,
    path: '/',
  },
  {
    id: 'search',
    icon: Search,
    path: '/search',
  },
  {
    id: 'favorites',
    icon: Heart,
    path: '/favorites',
  },
  {
    id: 'profile',
    icon: User,
    path: '/profile',
  },
]

export function BottomNavigation() {
  const location = useLocation()
  const { t } = useTranslation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      <div className="flex items-center justify-around px-4 py-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.id}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors duration-200 min-w-0 flex-1",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Icon 
                size={20} 
                className={cn(
                  "transition-transform duration-200",
                  isActive && "scale-110"
                )}
              />
              <span className={cn(
                "text-xs mt-1 font-medium transition-all duration-200",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {t(`navigation.${item.id}`)}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

