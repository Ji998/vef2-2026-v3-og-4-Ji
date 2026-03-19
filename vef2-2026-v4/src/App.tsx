import { Routes, Route, Navigate} from 'react-router-dom'
import HomePage from './pages/HomePage'
import ArticlePage from './pages/ArticlePage'
import CreateArticle from './pages/CreateArticel'
import NavBar from './components/NavBar'

export default function App() {
  return (
    <div style={{ padding: 16 }}>
      <NavBar manageLabel="Create" />

      <hr style={{ margin: '12px 0' }} />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/articles/:slug" element={<ArticlePage />} />
        <Route path="/manage" element={<CreateArticle />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}