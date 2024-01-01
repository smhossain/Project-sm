import HomeIcon from '@mui/icons-material/Home'
import PersonIcon from '@mui/icons-material/Person'
import AyahIcon from '@mui/icons-material/BookmarkBorder'
import SurahIcon from '@mui/icons-material/ImportContacts'
import TafeerIcon from '@mui/icons-material/MenuBook'

export const SideNavData = [
  {
    title: 'home',
    icon: <HomeIcon />,
    link: 'admin',
    subNav: []
  },
  {
    title: 'users',
    icon: <PersonIcon />,
    link: 'admin/manage-users',
    subNav: []
  },
  {
    title: 'surahs',
    icon: <SurahIcon />,
    link: 'admin/manage-surahs',
    subNav: []
  },
  {
    title: 'queries',
    icon: <AyahIcon />,
    link: '',
    subNav: [
      { title: 'all-queries', link: 'admin/manage-queries/all' },
      { title: 'unanswered', link: 'admin/manage-queries/unanswered' },
      { title: 'tags', link: 'admin/manage-queries/tags' }
    ]
  },
  {
    title: 'tafseer',
    icon: <TafeerIcon />,
    link: 'admin/manage-tafseers',
    subNav: []
  }
]
