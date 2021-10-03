import * as React from 'react';
import { Switch, Router, Route, Redirect } from 'react-router-dom';
import * as App from '../ClientApp/App';
import * as Utils from './infrastructure/Utils';
import * as RoutePath from './infrastructure/RoutePath'
const RoleRoute = ({ component: Component, ...rest }: { component: any, path?: string, exact?: boolean }) => (
    <Route {...rest} render={props => {
        return <Component {...props} />

    }} />
);
const AuthenticatedRoute = (
    { component: Component, ...rest }: { component: any, path: string, exact?: boolean }) => (
        <Route {...rest} render={props =>
            document["test"] != null ?
                <Component {...props} /> : <Redirect to={{ pathname: "/account/login", state: { from: props.location } }} />
        } />
    );
const AppRoute = ({ component: Component, layout: Layout = App.Layout, authenticated: boolean = false, ...rest }) => (
    <Router history={history}>
        <Switch>
            <Route {...rest} render={props => (
                <Layout routerHistory={history}>
                    <Component {...props} />
                </Layout>
            )} />
        </Switch>
    </Router>
)
const RouteWithLayout = ({ component: Component, layout:Layout, ...rest }) => (
    <Route {...rest}
        render={props => (
            <Layout routerHistory={history}>
                <Component {...props} />
            </Layout>
        )}
    />
)

const history = Utils.history
export const routes = <React.Fragment>
    <Router history={history}>
        <Switch>
            <RouteWithLayout exact path='/register' layout={App.EmptyLayout} component={App.Register} />
            <RouteWithLayout exact path='/' layout={App.Layout} component={App.Home} />
            <RouteWithLayout exact path={RoutePath.Path.team_create} layout={App.Layout} component={App.TeamCreate} />
            <RouteWithLayout exact path={RoutePath.Path.team_edit()} layout={App.Layout} component={App.TeamEdit} />
            <RouteWithLayout exact path={RoutePath.Path.employee} layout={App.Layout} component={App.Employees} />
            <RouteWithLayout exact path={RoutePath.Path.employee_create} layout={App.Layout} component={App.EmployeeCreate} />
            <RouteWithLayout exact path={RoutePath.Path.employee_edit()} layout={App.Layout} component={App.EmployeeEdit} />
            {/*<RoleRoute exact path='/' component={App.Home} />*/}
            <RouteWithLayout exact path={RoutePath.Path.test} layout={App.Layout} component={App.Test} />
            <RouteWithLayout exact path={RoutePath.Path.login} layout={App.Layout} component={App.Login} />
            <RouteWithLayout exact path={RoutePath.Path.article_create} layout={App.Layout} component={App.CreateArticle} />
            <RouteWithLayout exact path={RoutePath.Path.article_draft()} layout={App.Layout} component={App.CreateArticle} />
            {/*<RouteWithLayout exact path={RoutePath.Path.article_detail()} layout={App.Layout} component={App.ArticleDetail} />*/}
            {/* <RouteWithLayout exact path={RoutePath.Path.article_by_tags} layout={App.Layout} component={App.ArticlesByTags} />*/}
            <RouteWithLayout exact path={RoutePath.Path.article_edit()} layout={App.Layout}  component={App.UpdateArticle} />
            <RouteWithLayout exact path={RoutePath.Path.register} layout={App.Layout}  component={App.Register} />
            <RouteWithLayout exact path={RoutePath.Path.recommend_tags} layout={App.Layout} component={App.RecommendTags} />
            <RouteWithLayout exact path={RoutePath.Path.search_global} layout={App.Layout} component={App.SearchResult} />
            <RouteWithLayout exact path={RoutePath.Path.legal_term} layout={App.Layout} component={App.Term} />
            <Route component={App.Error} scope='error' />
        </Switch>
    </Router>
</React.Fragment>