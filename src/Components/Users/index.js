import React from 'react';
import { Switch, Route } from 'react-router-dom';

import List from './list';
import User from './user';
import AddUser from './addUserForm';
import MeetingForm from './Meetings/form';
import WebinarForm from './Webinars/form';
import Meeting from './Meetings/meeting';
import Webinar from './Webinars/webinar';

export default function Users() {
  return (
    <Switch>
      <Route path="/users/add">
        <AddUser />
      </Route>
      <Route path="/users/:userId/webinars/:webinarId">
        <Webinar />
      </Route>
      <Route path="/users/:userId/meetings/:meetingId">
        <Meeting />
      </Route>
      <Route path="/users/:userId/new_webinar">
        <WebinarForm />
      </Route>
      <Route path="/users/:userId/new_meeting">
        <MeetingForm />
      </Route>
      <Route path="/users/:userId">
        <User />
      </Route>
      <Route>
        <List />
      </Route>
    </Switch>
  );
}
