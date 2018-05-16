import React from 'react';
import { Notification, NotificationDrawer} from 'patternfly-react';
import { MenuItem, Icon, Button } from 'patternfly-react';

function handleClick() {
}

export class HuntNotificationArea extends React.Component {
     render() {
        return(<NotificationDrawer>
             <NotificationDrawer.Title id="1"/>
             <NotificationDrawer.Accordion>
             <NotificationDrawer.Panel expanded>
             <NotificationDrawer.PanelHeading>
             <NotificationDrawer.PanelTitle>
             <a onClick={handleClick()} aria-expanded="true">
             Rules management
             </a>
             </NotificationDrawer.PanelTitle>
             <NotificationDrawer.PanelCounter text="3 Unapplied Changes" />
             </NotificationDrawer.PanelHeading>
             <NotificationDrawer.PanelCollapse id="fixedCollapseOne" collapseIn>
             <NotificationDrawer.PanelBody>
             <Notification>
             <NotificationDrawer.Dropdown id="Dropdown1">
               <MenuItem eventKey="1" active>
                 Action
               </MenuItem>
               <MenuItem eventKey="2">
                 Another Action
               </MenuItem>
               <MenuItem eventKey="3">
                 Delete
               </MenuItem>
             </NotificationDrawer.Dropdown>
             <Icon className="pull-left" type="pf" name="info" />
                <Notification.Content>
                  <Notification.Message>
                     Info Notification
                  </Notification.Message>
                  <Notification.Info leftText="3/31/16" rightText="12:12:44 PM" />
                </Notification.Content>
             </Notification>
             <Notification>
             <NotificationDrawer.Dropdown id="Dropdown1">
             <MenuItem eventKey="1" active>
             Action
             </MenuItem>
             <MenuItem eventKey="2">
             Another Action
             </MenuItem>
             <MenuItem eventKey="3">
             Delete
             </MenuItem>
             </NotificationDrawer.Dropdown>
             <Icon className="pull-left" type="pf" name="ok" />
             <Notification.Content>
             <Notification.Message>
             Unread Notification
             </Notification.Message>
             <Notification.Info leftText="3/31/16" rightText="12:12:44 PM" />
             </Notification.Content>
             </Notification>
             <Notification>
             <NotificationDrawer.Dropdown id="DropDown2">
             <MenuItem eventKey="1" active>
             Action
             </MenuItem>
             <MenuItem eventKey="2">
             Another Action
             </MenuItem>
             <MenuItem eventKey="3">
             Delete
             </MenuItem>
             </NotificationDrawer.Dropdown>
             <Icon className="pull-left" type="pf" name="warning-triangle-o" />
             <Notification.Content>
             <Notification.Message>
             Another Event Notification that is really long to see how it reacts on smaller screens sizes.
             </Notification.Message>
             <Notification.Info leftText="3/31/16" rightText="12:12:44 PM" />
             </Notification.Content>
             </Notification>
             <Notification>
             <NotificationDrawer.Dropdown id="Dropdown3">
             <MenuItem eventKey="1" active>
             Action
             </MenuItem>
             <MenuItem eventKey="2">
             Another Action
             </MenuItem>
             <MenuItem eventKey="3">
             Delete
             </MenuItem>
             </NotificationDrawer.Dropdown>
             <Icon className="pull-left" type="pf" name="error-circle-o" />
             <Notification.Content>
             <Notification.Message>
             Error Notification
             </Notification.Message>
             <Notification.Info leftText="3/31/16" rightText="12:12:44 PM" />
             </Notification.Content>
             </Notification>
             </NotificationDrawer.PanelBody>
             <NotificationDrawer.PanelAction>
             <NotificationDrawer.PanelActionLink className="drawer-pf-action-link" data-toggle="mark-all-read">
             <Button bsStyle="link">
             Update Rulesets
             </Button>
             </NotificationDrawer.PanelActionLink>
             <NotificationDrawer.PanelActionLink data-toggle="clear-all">
             <Button bsStyle="link">
             <Icon type="pf" name="close" />
             Clear All
             </Button>
             </NotificationDrawer.PanelActionLink>
             </NotificationDrawer.PanelAction>
             </NotificationDrawer.PanelCollapse>
             </NotificationDrawer.Panel>
             <NotificationDrawer.Panel>
             <NotificationDrawer.PanelHeading>
             <NotificationDrawer.PanelTitle>
             <a onClick={handleClick()} aria-expanded="false" className="collapsed">
             Appliances management
             </a>
             </NotificationDrawer.PanelTitle>
             <NotificationDrawer.PanelCounter text="1 Unread Event" />
             </NotificationDrawer.PanelHeading>
             </NotificationDrawer.Panel>
             </NotificationDrawer.Accordion>
             </NotificationDrawer>
         )
     }
}
