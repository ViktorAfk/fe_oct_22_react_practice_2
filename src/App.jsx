import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';
import usersFromServer from './api/users';
import photosFromServer from './api/photos';
import albumsFromServer from './api/albums';

const filteredIfirmation = photosFromServer.map((photo) => {
  const album = albumsFromServer.find(
    (albumFrom) => albumFrom.id === photo.albumId,
  );
  const user = usersFromServer.find((userInfo) => userInfo.id === album.userId);

  return { ...photo, album, user };
});

const getPhilteredPhotos = (
  arrayOfInformation,
  { sortByUser, query, selectedAlbums },
) => {
  let coppyOfArray = [...arrayOfInformation];

  if (sortByUser) {
    coppyOfArray = coppyOfArray.filter(
      (coppyUser) => coppyUser.user.id === sortByUser,
    );
  }

  if (query) {
    const lowQuery = query.toLowerCase().trim();

    coppyOfArray = coppyOfArray.filter((photoTitle) => {
      const lowPhotoTitle = photoTitle.title.toLowerCase();

      return lowPhotoTitle.includes(lowQuery);
    });
  }

  if (selectedAlbums) {
    if (selectedAlbums.length < 1) {
      return coppyOfArray;
    }

    coppyOfArray = coppyOfArray
      .filter((selectCategory) => selectedAlbums
        .includes(selectCategory.album.id));
  }

  return coppyOfArray;
};
// {sortByUser, query, sortByAlbum}

export const App = () => {
  const [sortByUser, setSortByUser] = useState('');
  const [query, setQuery] = useState('');
  const [selectedAlbums, setSelectedAlbums] = useState([]);

  const toogleSelectAlbums = (id) => {
    if (selectedAlbums.includes(id)) {
      const newSelectedAlbums = selectedAlbums.filter(
        (selected) => selected !== id,
      );

      setSelectedAlbums(newSelectedAlbums);

      return;
    }

    setSelectedAlbums([...selectedAlbums, id]);
  };

  const photosForRender = getPhilteredPhotos(filteredIfirmation, {
    sortByUser,
    query,
    selectedAlbums,
  });

  const resetAllFilters = () => {
    setSortByUser('');
    setQuery('');
    setSelectedAlbums([]);
  };

  return (

    <div className="section">
      <div className="container">
        <h1 className="title">Photos from albums</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                href="#/"
                onClick={() => setSortByUser('')}
                className={cn({ 'is-active': !sortByUser })}
              >
                All
              </a>
              {usersFromServer.map((user) => (
                <a
                  key={user.id}
                  href="#/"
                  className={cn({ 'is-active': user.id === sortByUser })}
                  onClick={() => setSortByUser(user.id)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  {query && (
                    <button
                      aria-label="Close"
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  )}
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                className={cn('button is-success mr-6', {
                  'is-outlined': selectedAlbums.length,
                })}
                onClick={() => setSelectedAlbums([])}
              >
                All
              </a>
              {albumsFromServer.map((album) => {
                const cutName = album.title.split(' ');
                const albumName = cutName.splice(0, 1).join('');

                return (
                  <a
                    key={album.id}
                    className={cn('button mr-2 my-1', {
                      'is-info': selectedAlbums.includes(album.id),
                    })}
                    href="#/"
                    onClick={() => toogleSelectAlbums(album.id)}
                  >
                    {albumName}
                  </a>
                );
              })}
            </div>

            <div className="panel-block">
              <a
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => resetAllFilters()}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {!photosForRender.length ? (
            <p data-cy="NoMatchingMessage">
              No photos matching selected criteria
            </p>
          ) : (
            <table className="table is-striped is-narrow is-fullwidth">
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Photo name
                      <a href="#/">
                        <span className="icon">
                          <i className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Album name
                      <a href="#/">
                        <span className="icon">
                          <i className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User name
                      <a href="#/">
                        <span className="icon">
                          <i className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {photosForRender.map((photo) => (
                  <tr key={photo.id}>
                    <td className="has-text-weight-bold">{photo.id}</td>

                    <td>{photo.title}</td>
                    <td>{photo.album.title}</td>

                    <td
                      className={cn({
                        'has-text-link': photo.user.sex === 'm',
                        'has-text-danger': photo.user.sex === 'f',
                      })}
                    >
                      {photo.user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
