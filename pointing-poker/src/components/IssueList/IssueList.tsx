import { FC, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getIssues, deleteIssue, updateIssue, deleteGameRoundData, resetGameRoundDataThunk } from '../../redux/thunks';
import { selectIssues } from '../../redux/selectors';
import { IssueCard, IssueForm, BackDropModal } from '..';
import { USER_ROLES } from '../../constants';
import { Issue, IUser } from '../../interfaces';
import classes from './IssueList.module.scss';
import { deleteCurrentIssue, setCurrentIssue } from '../../redux/slices';

interface IssueListProps {
  currentUser: IUser;
}
const IssueList: FC<IssueListProps> = ({ currentUser }) => {
  const { id: userId, role, gameId } = currentUser;
  const isDealer = role === USER_ROLES.DEALER;
  const [isIssueFormOpen, setIsIssueFormOpen] = useState(false);
  const issues = useAppSelector(selectIssues);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getIssues(gameId));
  }, [dispatch, gameId, issues]);

  const handleClick = () => {
    setIsIssueFormOpen(prevState => !prevState);
  };

  const handleRemoveIssue = (id: string) => {
    dispatch(deleteIssue(id));
    dispatch(deleteCurrentIssue(id));
    dispatch(deleteGameRoundData({ gameId, userId, currentIssue: id }));
  };

  const handleSelectCurrentIssue = (issue: Partial<Issue>) => {
    dispatch(setCurrentIssue(issue.id));
    dispatch(updateIssue(issue));
    dispatch(resetGameRoundDataThunk({ gameId, userId }));
  };

  return (
    <>
      {isIssueFormOpen && (
        <BackDropModal isBackDropOpen={isIssueFormOpen}>
          <IssueForm gameId={gameId} creatorId={userId} handleCloseModal={handleClick} />
        </BackDropModal>
      )}
      <div className={classes.issueList}>
        <p className={classes.title}>Issues:</p>
        {isDealer && (
          <div className={classes.issueCard}>
            <p>Create New Issue</p>
            <button className={classes.btnCreate} onClick={handleClick}></button>
          </div>
        )}
        {issues.map(({ id, title, priority, gameId, isCurrent, creatorId }) => (
          <IssueCard
            key={id}
            id={id}
            title={title}
            priority={priority}
            gameId={gameId}
            creatorId={creatorId}
            isDealer={isDealer}
            isCurrent={isCurrent}
            handleSelectCurrentIssue={handleSelectCurrentIssue}
            handleRemoveIssue={handleRemoveIssue}
          />
        ))}
      </div>
    </>
  );
};

export { IssueList };
