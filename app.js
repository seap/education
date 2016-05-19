import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import helmet from 'helmet';

import routes from './routes';
import weixin from './routes/weixin';

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
if (__DEVELOPMENT__){
  app.use(express.static(path.join(__dirname, 'public')));
}
app.use(express.static(path.join(__dirname, 'static')));
// 禁用X-Powered-By, 禁止任何frame, iframe, XSS protections
app.use(helmet());
// 微信入口设置
app.use('/weixin', weixin);
app.use(routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

export default app;
