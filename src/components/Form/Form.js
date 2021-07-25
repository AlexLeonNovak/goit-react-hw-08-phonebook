import shortid from 'shortid';
import { connect } from 'react-redux';
import { Component } from 'react';
import PropTypes from 'prop-types';

import { notice } from '../../libs/pnotify';
import { FormGroup, Label, FormElement, Button, Input } from '../../Styles';

import { contactsSelectors, contactsOperations } from '../../redux/contacts';

const initState = {
	name: '',
	number: '',
};

class Form extends Component {
	state = initState;

	onInputChange = e => {
		const { name, value } = e.target;
		this.setState({ [name]: value });
	};

	onFormSubmit = e => {
		e.preventDefault();
		const { name, number } = this.state;
		const { contacts } = this.props;
		const isContactExist = contacts.some(
			contact => contact.name === name || contact.number === number,
		);
		if (isContactExist) {
			notice({
				title: 'The contact is already in the list',
				text: 'Please, add a contact with a different name or phone number',
			});
			return;
		}
		this.props.onFormSubmit({ ...this.state });
		this.setState(initState);
	};

	render() {
		const inputNameId = shortid.generate();
		const inputPhoneId = shortid.generate();

		return (
			<FormElement onSubmit={this.onFormSubmit}>
				<FormGroup>
					<Label htmlFor={inputNameId}>Name</Label>
					<Input
						id={inputNameId}
						type="text"
						name="name"
						value={this.state.name}
						onChange={this.onInputChange}
						pattern="^[a-zA-Zа-яА-Я]+(([' -][a-zA-Zа-яА-Я ])?[a-zA-Zа-яА-Я]*)*$"
						title="Имя может состоять только из букв, апострофа, тире и пробелов. Например Adrian, Jacob Mercer, Charles de Batz de Castelmore d'Artagnan и т. п."
						required
					/>
				</FormGroup>
				<FormGroup>
					<Label htmlFor={inputPhoneId}>Phone</Label>
					<Input
						id={inputPhoneId}
						type="tel"
						name="number"
						value={this.state.number}
						onChange={this.onInputChange}
						required
					/>
				</FormGroup>
				<FormGroup>
					<Button type="submit">Add contact</Button>
				</FormGroup>
			</FormElement>
		);
	}
}

Form.propTypes = {
	onFormSubmit: PropTypes.func.isRequired,
};

const mstp = state => ({
	contacts: contactsSelectors.getAllContacts(state),
});

const mdtp = dispatch => ({
	onFormSubmit: contact => dispatch(contactsOperations.addContact(contact)),
});

export default connect(mstp, mdtp)(Form);
