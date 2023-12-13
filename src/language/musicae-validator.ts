import type { ValidationAcceptor, ValidationChecks } from 'langium';
import type { Music, MusicaeAstType } from './generated/ast.js';
import type { MusicaeServices } from './musicae-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: MusicaeServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.MusicaeValidator;
    const checks: ValidationChecks<MusicaeAstType> = {
        Music: validator.checkPersonStartsWithCapital
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class MusicaeValidator {

    checkPersonStartsWithCapital(person: Music, accept: ValidationAcceptor): void {
        if (person.name) {
            const firstChar = person.name.substring(0, 1);
            if (firstChar.toUpperCase() !== firstChar) {
                accept('warning', 'Person name should start with a capital.', { node: person, property: 'name' });
            }
        }
    }

}
