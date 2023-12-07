
import { IUseRouter } from '@yimoko/store';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export const useRouter: IUseRouter = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  return { navigate, location, params };
};
