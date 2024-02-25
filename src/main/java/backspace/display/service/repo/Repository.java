package backspace.display.service.repo;

import backspace.display.field.Identifiable;

import java.util.List;

public interface Repository<T extends Identifiable> {
    T add(T t);

    void remove(T t);

    void removeById(String id);

    void update(T oldT, T newT);

    T getById(String id);

    List<T> getAll();

}