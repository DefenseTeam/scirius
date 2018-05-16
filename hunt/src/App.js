import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListView } from 'patternfly-react';
import { VerticalNav, Dropdown, Icon, MenuItem, PaginationRow, Spinner } from 'patternfly-react';
import { AboutModal } from 'patternfly-react';
import { PAGINATION_VIEW, PAGINATION_VIEW_TYPES } from 'patternfly-react';
import { RuleFilter } from './Filter.js';
import { HuntDashboard } from './Dashboard.js';
import { HuntNotificationArea } from './Notifications.js';
import { PAGE_STATE } from './Const.js';
import { RuleInList, RuleCard, RulePage, updateHitsStats } from './Rule.js';
import axios from 'axios';
import * as config from './config/Api.js';
import 'bootstrap3/dist/css/bootstrap.css'
import 'patternfly/dist/css/patternfly.css'
import 'patternfly/dist/css/patternfly-additions.css'
import 'patternfly-react/dist/css/patternfly-react.css'
import './App.css';
import scirius_logo from './img/scirius-by-stamus.svg';

class HuntApp extends Component {
  constructor(props) {
    super(props);
    var duration = localStorage.getItem('duration');
    var rules_list_conf = localStorage.getItem('rules_list');
    var page_display = localStorage.getItem('page_display');
    if (!duration) {
	    duration = 24;
    }
    if (!rules_list_conf) {
        rules_list_conf = {
            pagination: {
              page: 1,
              perPage: 6,
              perPageOptions: [6, 10, 15, 25, 50]
            },
            filters: [],
            sort: {id: 'created', asc: false},
            view_type: 'list'
        };
        localStorage.setItem('rules_list', JSON.stringify(rules_list_conf));
    } else {
        rules_list_conf = JSON.parse(rules_list_conf);
    }
    if (!page_display) {
        page_display = { page: PAGE_STATE.rules_list, item:undefined };
        localStorage.setItem('page_display', JSON.stringify(page_display));
    } else {
        page_display = JSON.parse(page_display);
    }
    this.state = {
      sources: [], rulesets: [], duration: duration, from_date: (Date.now() - duration * 3600 * 1000),
      display: page_display,
      rules_list: rules_list_conf
    };
    this.displaySource = this.displaySource.bind(this);
    this.displayRuleset = this.displayRuleset.bind(this);
    this.changeDuration = this.changeDuration.bind(this);

    this.fromDate = this.fromDate.bind(this);

    this.onHomeClick = this.onHomeClick.bind(this);
    this.onDashboardClick = this.onDashboardClick.bind(this);
    this.onHistoryClick = this.onHistoryClick.bind(this);
    this.switchPage = this.switchPage.bind(this);
    this.updateRuleListState = this.updateRuleListState.bind(this);
    
  }

    onHomeClick() {
        this.switchPage(PAGE_STATE.rules_list, undefined);
    }
    
    
    onDashboardClick() {
        this.switchPage(PAGE_STATE.dashboards, undefined);
    }
    
    onHistoryClick() {
    
    }

    fromDate(period) {
	const duration = period * 3600 * 1000;
	return Date.now() - duration;
    }

    componentDidMount() {
      axios.all([
          axios.get(config.API_URL + config.SOURCE_PATH),
          axios.get(config.API_URL + config.RULESET_PATH),
	  ])
      .then(axios.spread((SrcRes, RulesetRes) => {
         this.setState({ rulesets: RulesetRes.data['results'], sources: SrcRes.data['results']});
      }))
    }

    displayRuleset(ruleset) {
        this.switchPage(PAGE_STATE.ruleset, ruleset);
    }
    
    displaySource(source) {
        this.switchPage(PAGE_STATE.source, source);
    }

   changeDuration(period) {
	this.setState({ duration: period, from_date: this.fromDate(period)});
	localStorage.setItem('duration', period);
   }

  switchPage(page, item) {
      if (!page) {
	      console.log("switchPage called with null param");
	      return;
      }
      const page_display = {page: page, item: item};
      this.setState({display: page_display});
      localStorage.setItem('page_display', JSON.stringify(page_display));
  }
 
    updateRuleListState(rules_list_state) {
        this.setState({rules_list: rules_list_state});
        localStorage.setItem('rules_list', JSON.stringify(rules_list_state));
    }

    render() {
            var displayed_page = undefined;
            switch (this.state.display.page) {
               case PAGE_STATE.rules_list:
               default:
                  displayed_page = <RulesList rules_list={this.state.rules_list} from_date={this.state.from_date} SwitchPage={this.switchPage} updateRuleListState={this.updateRuleListState} />
                  break;
               case PAGE_STATE.source:
                  displayed_page = <SourcePage source={this.state.display.item} from_date={this.state.from_date}/>
                  break;
               case PAGE_STATE.ruleset:
                  displayed_page = <RulesetPage ruleset={this.state.display.item} from_date={this.state.from_date}/>
                  break;
               case PAGE_STATE.rule:
                  displayed_page = <RulePage rule={this.state.display.item} from_date={this.state.from_date}/>
                  break;
               case PAGE_STATE.dashboards:
                  displayed_page = <HuntDashboard from_date={this.state.from_date}/>
                  break;
            }
        return(
            <div className="layout-pf layout-pf-fixed faux-layout">
                <VerticalNav sessionKey="storybookItemsAsJsx" showBadges>
            	    <VerticalNav.Masthead title="Scirius">
						<VerticalNav.Brand titleImg={scirius_logo} />
						<VerticalNav.IconBar>
							<UserNavInfo ChangeDuration={this.changeDuration} period={this.state.duration}/>
						</VerticalNav.IconBar>
					</VerticalNav.Masthead>
		   <VerticalNav.Item
            	      title="Home"
            	      iconClass="fa fa-home"
            	      initialActive = { this.state.display.page === PAGE_STATE.rules_list }
            	      onClick={this.onHomeClick}
            	      className={null}
            	    />

            	    <VerticalNav.Item
            	      title="Dashboards"
            	      iconClass="fa fa-tachometer"
            	      initialActive = { this.state.display.page === PAGE_STATE.dashboards }
            	      onClick={this.onDashboardClick}
            	      className={null}
            	    >
            	    </VerticalNav.Item>
            	    <VerticalNav.Item title="IDS rules" iconClass="glyphicon glyphicon-eye-open">
            	        <VerticalNav.SecondaryItem title="Sources" >
                	    {this.state.sources.map(function(source) {
				    return(
	    		     <VerticalNav.TertiaryItem key={source.pk} title={source.name}  onClick={this.displaySource.bind(this, source)}  />
			     )
			     }, this)}
	    		     <VerticalNav.TertiaryItem title="Add Source" href="/rules/source/add" />
            	        </VerticalNav.SecondaryItem>
       			<VerticalNav.SecondaryItem title="Rulesets">
                	    {this.state.rulesets.map(function(ruleset) {
				    return(
	    		     <VerticalNav.TertiaryItem key={ruleset.pk} title={ruleset.name} onClick={this.displayRuleset.bind(this, ruleset)} />
			     )
			     }, this)}
	    		     <VerticalNav.TertiaryItem title="Add Ruleset" href="/rules/ruleset/add" >
        			<Icon type="pf" name="help" />
			     </VerticalNav.TertiaryItem>
            	        </VerticalNav.SecondaryItem>
       	             </VerticalNav.Item>
       		     <VerticalNav.Item
		      title="History"
		      iconClass="glyphicon glyphicon-list"
            	      initialActive = { this.state.display.page === PAGE_STATE.history }
            	      onClick={this.onHistoryClick}
		     />
       		     <VerticalNav.Item 
		       title="Setup"
		       iconClass="glyphicon glyphicon-cog"
              	       initialActive = { this.state.display.page === PAGE_STATE.setup }
		       href="/appliances"
		     />
       		</VerticalNav>
       		<div className="container-fluid container-cards-pf container-pf-nav-pf-vertical nav-pf-persistent-secondary">
       			<div className="row row-cards-pf">
			    <div className="col-xs-12 col-sm-12 col-md-12" id="app-content" >
                                {displayed_page}
	       	            </div>
       	         	</div>
       	        </div>
       	    </div>
        )
    }
}


const USER_PERIODS = {
  1: '1h',
  6: '6h',
  24: '24h',
  48: '2d',
  168: '7d',
  720: '30d'
};

class UserNavInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
	    showModal: false,
	    showNotifications: false
    }
    this.AboutClick = this.AboutClick.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.toggleNotifications = this.toggleNotifications.bind(this);
  }

  AboutClick(e) {
	  this.setState({showModal: true});
  }
  closeModal(e) {
	  this.setState({showModal: false});
  }
  toggleNotifications(e) {
	  this.setState({showNotifications: !this.state.showNotifications});
  }

	render() {
		return(
			<React.Fragment>
        		<li className="dropdown">
			   <a id="notifications" className="nav-item-iconic" onClick={this.toggleNotifications}>
			      <Icon type="fa" name="bell" />
			   </a>
			</li>
			{this.state.showNotifications &&
			<HuntNotificationArea />
			}
    			<Dropdown componentClass="li" id="help">
      				<Dropdown.Toggle useAnchor className="nav-item-iconic">
        				<Icon type="pf" name="help" />
      				</Dropdown.Toggle>
      				<Dropdown.Menu>
        				<MenuItem>Help</MenuItem>
        				<MenuItem onClick={this.AboutClick}>About</MenuItem>
      				</Dropdown.Menu>
    			</Dropdown>
			    <Dropdown componentClass="li" id="time">
      				<Dropdown.Toggle useAnchor className="nav-item-iconic">
        				<Icon type="fa" name="clock-o" /> Last {USER_PERIODS[this.props.period]}
      				</Dropdown.Toggle>
      				<Dropdown.Menu>
				        {Object.keys(USER_PERIODS).map((period) => {
        				return (<MenuItem key={period} onClick={this.props.ChangeDuration.bind(this, period)}>Last {USER_PERIODS[period]}</MenuItem>)
					}, this)}
    				</Dropdown.Menu>
			   </Dropdown>
			    <Dropdown componentClass="li" id="user">
      				<Dropdown.Toggle useAnchor className="nav-item-iconic">
        				<Icon type="pf" name="user" /> Eric Leblond
      				</Dropdown.Toggle>
      				<Dropdown.Menu>
        				<MenuItem>Preferences</MenuItem>
        				<MenuItem>Logout</MenuItem>
    				</Dropdown.Menu>
			   </Dropdown>
			   
        <AboutModal
          show={this.state.showModal}
          onHide={this.closeModal}
          productTitle="Scirius Enterprise Edition"
          logo={scirius_logo}
          altLogo="SEE Logo"
          trademarkText="Copyright 2014-2018, Stamus Networks"
        >
          <AboutModal.Versions>
            <AboutModal.VersionItem label="Version" versionText="31.0.0" />
          </AboutModal.Versions>
        </AboutModal>
			</React.Fragment>
		)
	}
}


class HuntPaginationRow extends Component {
  constructor(props) {
    super(props);
    this.onPageInput = this.onPageInput.bind(this);
    this.onPerPageSelect = this.onPerPageSelect.bind(this);
  };

  onPageInput = e => {
    const newPaginationState = Object.assign({}, this.props.pagination);
    newPaginationState.page = e.target.value;
    this.props.onPaginationChange(newPaginationState);
  }

  onPerPageSelect = (eventKey, e) => {
    const newPaginationState = Object.assign({}, this.props.pagination);
    newPaginationState.perPage = eventKey;
    this.props.onPaginationChange(newPaginationState);
  }

  render() {
    const {
      viewType,
      pageInputValue,
      amountOfPages,
      pageSizeDropUp,
      itemCount,
      itemsStart,
      itemsEnd,
      onFirstPage,
      onPreviousPage,
      onNextPage,
      onLastPage
    } = this.props;

    return (
      <PaginationRow
        viewType={viewType}
        pageInputValue={pageInputValue}
        pagination={this.props.pagination}
        amountOfPages={amountOfPages}
        pageSizeDropUp={pageSizeDropUp}
        itemCount={itemCount}
        itemsStart={itemsStart}
        itemsEnd={itemsEnd}
        onPerPageSelect={this.onPerPageSelect}
        onFirstPage={onFirstPage}
        onPreviousPage={onPreviousPage}
        onPageInput={this.onPageInput}
        onNextPage={onNextPage}
        onLastPage={onLastPage}
      />
    );
  }
}

function noop() {
	return;
}

HuntPaginationRow.propTypes = {
  viewType: PropTypes.oneOf(PAGINATION_VIEW_TYPES).isRequired,
  pageInputValue: PropTypes.number.isRequired,
  amountOfPages: PropTypes.number.isRequired,
  pageSizeDropUp: PropTypes.bool,
  itemCount: PropTypes.number.isRequired,
  itemsStart: PropTypes.number.isRequired,
  itemsEnd: PropTypes.number.isRequired,
  onFirstPage: PropTypes.func,
  onPreviousPage: PropTypes.func,
  onNextPage: PropTypes.func,
  onLastPage: PropTypes.func
};

HuntPaginationRow.defaultProps = {
  pageSizeDropUp: true,
  onFirstPage: noop,
  onPreviousPage: noop,
  onNextPage: noop,
  onLastPage: noop
};


class RulesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rules: [], categories: [], rules_count: 0,
      loading: true,
      refresh_data: false,
    };
    this.fetchData = this.fetchData.bind(this);
    this.fetchHitsStats = this.fetchHitsStats.bind(this);
    this.handlePaginationChange = this.handlePaginationChange.bind(this);
    this.onFirstPage = this.onFirstPage.bind(this);
    this.onNextPage = this.onNextPage.bind(this);
    this.onPrevPage = this.onPrevPage.bind(this);
    this.onLastPage = this.onLastPage.bind(this);
    this.UpdateFilter = this.UpdateFilter.bind(this);
    this.UpdateSort = this.UpdateSort.bind(this);

    this.setViewType = this.setViewType.bind(this);

    this.updateRulesState = this.updateRulesState.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
     if (prevProps.from_date !==  this.props.from_date) {
             this.fetchHitsStats(this.state.rules);
     }
  }

  handlePaginationChange(pagin) {
     const newRuleState = Object.assign({}, this.props.rules_list);
     newRuleState.pagination = pagin;
     this.props.updateRuleListState(newRuleState);
     this.fetchData(newRuleState);
  }

  onFirstPage() {
     const newRuleState = Object.assign({}, this.props.rules_list);
     newRuleState.pagination.page = 1;
     this.props.updateRuleListState(newRuleState);
     this.fetchData(newRuleState);
  }

  onNextPage() {
     const newRuleState = Object.assign({}, this.props.rules_list);
     newRuleState.pagination.page = newRuleState.pagination.page + 1;
     this.props.updateRuleListState(newRuleState);
     this.fetchData(newRuleState);
  }

  onPrevPage() {
     const newRuleState = Object.assign({}, this.props.rules_list);
     newRuleState.pagination.page = newRuleState.pagination.page - 1;
     this.props.updateRuleListState(newRuleState);
     this.fetchData(newRuleState);
  }

  onLastPage() {
     const newRuleState = Object.assign({}, this.props.rules_list);
     newRuleState.pagination.page = Math.floor(this.state.rules_count / this.props.rules_list.pagination.perPage) + 1;
     this.props.updateRuleListState(newRuleState);
     this.fetchData(newRuleState);
  }

   UpdateFilter(filters) {
     const newRuleState = Object.assign({}, this.props.rules_list);
     newRuleState.filters = filters;
     newRuleState.pagination.page = 1;
     this.props.updateRuleListState(newRuleState);
     this.fetchData(newRuleState);
   }

   UpdateSort(sort) {
     const newRuleState = Object.assign({}, this.props.rules_list);
     newRuleState.sort = sort;
     this.props.updateRuleListState(newRuleState);
     this.fetchData(newRuleState);
   }

   setViewType(type) {
        const newRuleState = Object.assign({}, this.props.rules_list);
        newRuleState.view_type = type;
        this.props.updateRuleListState(newRuleState);
   }

   buildQFilter(filters) {
     var qfilter = [];
     for (var i=0; i < filters.length; i++) {
	if (filters[i].id === 'probe') {
            qfilter.push('host.raw:' + filters[i].value);
	    continue;
	} else if (filters[i].id === 'sprobe') {
            qfilter.push('host.raw:' + filters[i].value.id);
	    continue;
	}
     }
     if (qfilter.length === 0) {
	 return undefined;
     }
     return qfilter.join(" AND ");
   }

   buildFilter(filters) {
     var l_filters = {};
     for (var i=0; i < filters.length; i++) {
	if (filters[i].id !== 'probe') {
               if (filters[i].id in l_filters) {
               l_filters[filters[i].id] += "," + filters[i].value;
            } else {
               l_filters[filters[i].id] = filters[i].value;
            }
	}
     }
     var string_filters = "";
     for (var k in l_filters) {
         string_filters += "&" + k + "=" + l_filters[k];
     }
     var qfilter = this.buildQFilter(filters);
     if (qfilter) {
	 string_filters += '&qfilter=' +  qfilter;
     }
     return string_filters;
   }

  updateRulesState(rules) {
         this.setState({rules: rules});
  }

  buildTimelineDataSet(tdata) {
    var timeline = {x : 'x', type: 'area',  columns: [['x'], ['alerts']]};
    for (var key in tdata) {
        timeline.columns[0].push(tdata[key].date);
        timeline.columns[1].push(tdata[key].hits);
    }
    return timeline;
  }

  buildHitsStats(rules) {
       for (var rule in rules) {
          rules[rule].timeline = this.buildTimelineDataSet(rules[rule].timeline_data);
	  rules[rule].timeline_data = undefined;
       }
       this.updateRulesState(rules);
   }

  fetchHitsStats(rules) {
	 var qfilter = this.buildQFilter(this.props.rules_list.filters);
         updateHitsStats(rules, this.props.from_date, this.updateRulesState, qfilter);
  }

  fetchData(rules_stat) {
     var page = rules_stat.pagination.page;
     var per_page = rules_stat.pagination.perPage;
     var filters = rules_stat.filters;
     var sort = rules_stat.sort;
     var string_filters = this.buildFilter(filters);
     var ordering = "";

     if (sort['asc']) {
        ordering=sort['id'];
     } else {
        ordering="-" + sort['id'];
     }

     this.setState({refresh_data: true});
     axios.all([
          axios.get(config.API_URL + config.RULE_PATH + "?ordering=" + ordering + "&page_size=" + per_page + "&page=" + page + "&from_date=" + this.props.from_date + string_filters),
          axios.get(config.API_URL + config.CATEGORY_PATH + "?page_size=100"),
	  ])
      .then(axios.spread((RuleRes, CatRes) => {
	 var categories_array = CatRes.data['results'];
	 var categories = {};
	 for (var i = 0; i < categories_array.length; i++) {
	     var cat = categories_array[i];
	     categories[cat.pk] = cat;
	 }
         this.setState({ rules_count: RuleRes.data['count'], rules: RuleRes.data['results'], categories: categories, loading: false, refresh_data: false});
	 if (!RuleRes.data.results[0].timeline_data) {
	     this.fetchHitsStats(RuleRes.data['results']);
	 } else {
             this.buildHitsStats(RuleRes.data['results']);
	 }
     }))
  }

  componentDidMount() {
      this.fetchData(this.props.rules_list)
  }
  
  render() {
    return (
        <div className="RulesList">
	<Spinner loading={this.state.loading} >
	    <RuleFilter ActiveFilters={this.props.rules_list.filters} rules_list={this.props.rules_list} ActiveSort={this.props.rules_list.sort} UpdateFilter={this.UpdateFilter}  UpdateSort={this.UpdateSort} setViewType={this.setViewType}/>
            {this.props.rules_list.view_type === 'list' &&
	    <ListView>
            {this.state.rules.map(function(rule) {
                return(
                   <RuleInList key={rule.pk} data={rule} state={this.state} from_date={this.props.from_date} SwitchPage={this.props.SwitchPage} />
                )
             },this)}
	    </ListView>
            }
            {this.props.rules_list.view_type === 'card' &&
                <div className='container-fluid container-cards-pf'>
                <div className='row row-cards-pf'>
                {this.state.rules.map(function(rule) {
                         return(
                                <RuleCard key={rule.pk} data={rule} state={this.state} from_date={this.props.from_date} SwitchPage={this.props.SwitchPage} />
                )
             },this)}
                </div>
                </div>
            }
	    <HuntPaginationRow
	        viewType = {PAGINATION_VIEW.LIST}
	        pagination={this.props.rules_list.pagination}
	        onPaginationChange={this.handlePaginationChange}
		amountOfPages = {Math.ceil(this.state.rules_count / this.props.rules_list.pagination.perPage)}
		pageInputValue = {this.props.rules_list.pagination.page}
		itemCount = {this.state.rules_count}
		itemsStart = {(this.props.rules_list.pagination.page - 1) * this.props.rules_list.pagination.perPage}
		itemsEnd = {Math.min(this.props.rules_list.pagination.page * this.props.rules_list.pagination.perPage - 1, this.state.rules_count) }
		onFirstPage={this.onFirstPage}
		onNextPage={this.onNextPage}
		onPreviousPage={this.onPrevPage}
		onLastPage={this.onLastPage}

	    />
	    </Spinner>
        </div>
    );
  }
}

class SourcePage extends Component {
    render() {
	var source = this.props.source;
        return (
            <h1>{source.name}</h1>
	)
    }
}

class RulesetPage extends Component {
    render() {
	var ruleset = this.props.ruleset;
        return (
            <h1>{ruleset.name}</h1>
	)
    }
}

export default HuntApp;
