import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import { Navigation } from './components/Navigation'
import {HomePage} from './pages/home'
import { SearchPage } from './pages/SearchPage'
import { FavoritesPage } from './pages/FavoritesPage'
import { ProfilePage } from './pages/profile'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Navigation />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: 'search',
            element: <SearchPage />,
          },
          {
            path: 'favorites',
            element: <FavoritesPage />,
          },
          {
            path: 'profile',
            element: <ProfilePage />,
          },
        ],
      },
    ],
  },
])
