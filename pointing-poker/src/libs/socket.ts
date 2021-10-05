import { Dispatch } from '@reduxjs/toolkit';
import { io, Socket } from 'socket.io-client';
import {
  addMessage,
  addIssue,
  updateIssue,
  deleteIssue,
  deleteUser,
  updateGameStatus,
  updateUser,
} from '../redux/thunks';
import {
  enableVote,
  startGameRound,
  updateGameRoundData,
  memberJoin,
  setRoundStatisticFromServer,
  resetGameRoundData,
  addNewComer,
  admitToGame,
  rejectToGame,
  updateRoundStatistics,
  updateTimer,
  setLogoutSuccessStatus,
  setNewUserJoinedStatus,
  setNewUserLeftStatus,
} from '../redux/slices';
import { URL } from '../constants';
import { updateSettings } from '../redux/slices/gameSettingsSlice';
import { logout } from '../redux/actions';

export const initSocket = (userId: string, gameId: string, dispatch: Dispatch): Socket => {
  const socket = io(URL, {
    transports: ['websocket', 'polling'],
    auth: {
      userId,
    },
  });

  socket.emit('joinToRoom', gameId);

  socket.on('connect', () => {
    console.log(`socket connected: ${socket.id}`);
  });

  socket.on('memberJoin', user => {
    dispatch(memberJoin(user));
    dispatch(setNewUserJoinedStatus());
  });

  socket.on('memberLeave', deletedUserId => {
    if (userId === deletedUserId) {
      dispatch(logout());
      dispatch(setLogoutSuccessStatus());
    } else {
      dispatch({ type: deleteUser.fulfilled.type, payload: deletedUserId });
      dispatch(setNewUserLeftStatus());
    }
  });

  socket.on('userUpdate', user => {
    dispatch({ type: updateUser.fulfilled.type, payload: user });
  });

  socket.on('message', message => {
    dispatch({ type: addMessage.fulfilled.type, payload: message });
  });

  socket.on('issueAdd', issue => {
    dispatch({ type: addIssue.fulfilled.type, payload: issue });
  });

  socket.on('issueUpdate', issues => {
    dispatch({ type: updateIssue.fulfilled.type, payload: issues });
  });

  socket.on('issueDelete', issueId => {
    dispatch({ type: deleteIssue.fulfilled.type, payload: issueId });
  });

  socket.on('vote', ({ victim, currentUserId }) => {
    if (victim.id !== userId) {
      dispatch(enableVote({ victim, currentUserId }));
    }
  });

  socket.on('gameStatus', status => {
    dispatch({ type: updateGameStatus.fulfilled.type, payload: status });
  });

  socket.on('gameSettings', gameSettings => {
    dispatch(updateSettings({ ...gameSettings }));
  });

  socket.on('startGameRound', gameRoundData => {
    dispatch(startGameRound({ ...gameRoundData }));
  });

  socket.on('updateGameRoundData', playerCards => {
    dispatch(updateGameRoundData(playerCards));
  });

  socket.on('resetGameRoundData', () => {
    dispatch(resetGameRoundData());
  });

  socket.on('getRoundStatistic', roundStatistic => {
    dispatch(setRoundStatisticFromServer(roundStatistic));
  });

  socket.on('updateGameRoundStatistics', roundStatistics => {
    dispatch(updateRoundStatistics(roundStatistics));
  });

  socket.on('notifyDealer', user => {
    dispatch(addNewComer(user));
  });

  socket.on('admitToGame', () => {
    dispatch(admitToGame());
    dispatch({ type: updateGameStatus.fulfilled.type, payload: true });
  });

  socket.on('rejectToGame', () => {
    dispatch(rejectToGame());
  });

  socket.on('cancelGame', () => {
    dispatch(logout());
  });

  socket.on('disconnect', reason => {
    console.log(`socked disconnected: ${reason}`);
  });

  socket.on('timer', timer => {
    dispatch(updateTimer(timer));
  });

  return socket;
};
