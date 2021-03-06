import React from 'react';
import { Form, Button, Input, Header, Modal } from 'semantic-ui-react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { withFormik } from 'formik';
import Yup from 'yup';
import { withRouter } from 'react-router-dom'

import '../Style/Form.css';

const MessageBox = props => {
  const {
    values,
    touched,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
  } = props;
  return (
    <Modal className="ui modal" show>
      <Header as="h2">Message</Header>
      <Form>
        <Form.Field >
          <Input
            id="target"
            type="text"
            autoComplete="user"
            onChange={handleChange}
            value={values.target}
            placeholder="User"
            fluid
            className={errors.target && touched.target ? 'text-input error' : 'text-input'}
          />
        </Form.Field>

        {errors.target &&
          touched.target && <div className="input-feedback">{errors.target}</div>}

        <Form.Field>
          <Input
            id="text"
            onChange={handleChange}
            value={values.text}
            type="text"
            placeholder=""
            fluid
            autoComplete="text"
            className={errors.text && touched.text ? 'text-input error' : 'text-input'}
          />
        </Form.Field>


        <Button type="submit" disabled={isSubmitting} onClick={handleSubmit}>Submit</Button>
      </Form>
      {errors.text &&
        touched.text && <div className="input-feedback">{errors.text}</div>}
      {props.errors.error && <div>{props.errors.error.target}</div>}
    </Modal>
  );
};

const CREATE_MESSAGE_MUTATION = gql`
  mutation CreateMessageMutation($target: String!, $text: String!) {
    createMessage(target: $target, text: $text) {
      text
      target {
        id
      }
    }
  }
`

export default compose(
  withRouter,
  graphql(CREATE_MESSAGE_MUTATION),
  withFormik({
    mapPropsToValues: () => ({ target: '', text: '', error: '' }),
    validationSchema: Yup.object().shape({
      target: Yup.string()
        .required('Username is required.'),
      text: Yup.string()
        .required('You must input a message.'),
    }),
    handleSubmit: async (
      values,
      { props: { target, text, errors, mutate, history }, setSubmitting, setFieldError },
    ) => {
      const response = await mutate({
        variables: { target: values.target, text: values.text, error: values.error },
      })

      const valid = response.data.createMessage.target

      if (valid !== null) {
        setSubmitting(false)
        history.push('/feed')
      } else {
        setSubmitting(false)
        setFieldError("error", { target: "User not found." })
      }
    },
    displayName: 'MessageBox', // helps with React DevTools
  }))(MessageBox);

  