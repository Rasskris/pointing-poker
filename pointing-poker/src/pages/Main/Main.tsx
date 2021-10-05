import { ChangeEvent, FC, FormEvent, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BackDropModal, Button, LoginForm, ConnectNotification } from '../../components/index';
import { USER_LEAVING__TEXT, USER_ROLES } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectExistGameStatus, selectLogoutSuccessStatus } from '../../redux/selectors';
import { resetLogoutSuccessStatus } from '../../redux/slices';
import { checkExistGame } from '../../redux/thunks';
import classes from './Main.module.scss';

const Main: FC = () => {
  const isExistGame = useAppSelector(selectExistGameStatus);
  const [gameId, setGameId] = useState('');
  const [isLoginFormOpen, setIsLoginFormOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [role, setRole] = useState<USER_ROLES | null>(null);
  const isLogoutStatusSuccess = useAppSelector(selectLogoutSuccessStatus);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isExistGame === false) {
      setIsNotificationOpen(true);
      setGameId('');
    } else if (isExistGame === true) {
      setIsLoginFormOpen(true);
    }
  }, [isExistGame]);

  useEffect(() => {
    if (isLogoutStatusSuccess) {
      toast(USER_LEAVING__TEXT, {
        position: 'top-center',
        theme: 'colored',
      });
      dispatch(resetLogoutSuccessStatus());
    }
  });

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setGameId(target.value);
  };

  const handleStartGame = () => {
    setRole(USER_ROLES.DEALER);
    setIsLoginFormOpen(true);
    setGameId('');
  };

  const handleConnectGame = (event: FormEvent) => {
    event.preventDefault();

    dispatch(checkExistGame(gameId));
    setRole(USER_ROLES.PLAYER);
  };

  const handleCloseModal = () => {
    setIsLoginFormOpen(false);
    setIsNotificationOpen(false);
  };

  return (
    <div className={classes.wrapper}>
      <ToastContainer />
      {isLoginFormOpen && (
        <BackDropModal isBackDropOpen={isLoginFormOpen} titleModal="Connect to lobby">
          <LoginForm gameId={gameId} onModalCloseHandler={handleCloseModal} role={role as USER_ROLES} />
        </BackDropModal>
      )}
      {isNotificationOpen && (
        <BackDropModal isBackDropOpen={isNotificationOpen}>
          <ConnectNotification onModalCloseHandler={handleCloseModal} />
        </BackDropModal>
      )}
      <p className={classes.logo}>Poker Planning </p>
      <h1 className={classes.header}>Start your planning:</h1>
      <div className={classes.create}>
        <p>Create session:</p>
        <Button text="Start new game" colorButton="dark" type="button" onClick={handleStartGame} />
      </div>
      <p className={classes.header}>OR:</p>
      <div className={classes.connect}>
        <form className={classes.form} onSubmit={handleConnectGame}>
          <label>
            Connect to lobby by URL:
            <input type="text" value={gameId} onChange={handleChange} required />
          </label>
          <Button type="submit" text="Connect" colorButton="dark" />
        </form>
      </div>
    </div>
  );
};

export { Main };
