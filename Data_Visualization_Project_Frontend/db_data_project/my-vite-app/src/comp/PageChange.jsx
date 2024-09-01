// PageChange.jsx
import { Link } from 'react-router-dom';

export const PageChange = () => {
  return (
    <div>
      <nav>
        <Link to="/TablePage">
          <button>Table Page</button>
        </Link>
        <Link to="/ArchitectPage">
          <button>Architecture Page</button>
        </Link>
      </nav>
    </div>
  );
};
